using System.Security.Claims;
using LetDoIt.Api.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Data.Common;

namespace LetDoIt.Api.Services;

public class ProjectService(LetDoItContext context) : IProjectService
{
    private readonly LetDoItContext _context = context;

    public async Task<bool> ChangeProjectAuthorAsync(Guid projectId, Guid newAuthorId, ClaimsPrincipal user)
    {
        var requesterId = GetUserId(user);

        // Lấy currentAuthorId từ DB để đảm bảo an toàn (không tin client)
        var project = await _context.Projects.AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProjectId == projectId)
            ?? throw new ArgumentException("Project does not exist!");

        if (project.UserId != requesterId)
            throw new UnauthorizedAccessException("You are not the owner of this project!");

        // Dùng UserId thực từ DB thay vì currentAuthorId từ client
        var actualCurrentOwnerId = project.UserId;

        using var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();

        using var transaction = connection.BeginTransaction();
        try
        {
            // 1. Cập nhật bảng projects (Đổi chủ)
            string updateProjectSql = @"
            UPDATE ""Projects""
            SET ""CreatedBy"" = @NewOwnerId
            WHERE ""project_id"" = @ProjectId AND ""CreatedBy"" = @CurrentOwnerId;";

            // 2. Hạ quyền chủ cũ xuống làm Member
            string demoteOldOwnerSql = @"
            UPDATE ""ProjectMembers"" 
            SET ""Role"" = 'Member' 
            WHERE ""ProjectId"" = @ProjectId AND ""UserId"" = @CurrentOwnerId;";

            // 3. Đôn chủ mới lên làm Manager
            string promoteNewOwnerSql = @"
            UPDATE ""ProjectMembers"" 
            SET ""Role"" = 'Manager' 
            WHERE ""ProjectId"" = @ProjectId AND ""UserId"" = @NewOwnerId;";

            var affectedRows = await connection.ExecuteAsync(
                updateProjectSql,
                new { ProjectId = projectId, NewOwnerId = newAuthorId, CurrentOwnerId = actualCurrentOwnerId },
                transaction);

            if (affectedRows == 0)
            {
                transaction.Rollback();
                return false;
            }

            await connection.ExecuteAsync(demoteOldOwnerSql, new { ProjectId = projectId, CurrentOwnerId = actualCurrentOwnerId }, transaction);
            await connection.ExecuteAsync(promoteNewOwnerSql, new { ProjectId = projectId, NewOwnerId = newAuthorId }, transaction);

            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<GetProjectRequest> CreateProjectAsync(CreateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        if (await _context.Projects.AnyAsync(p => p.Title.Equals(request.Title) && p.UserId == userId && !p.IsDeleted))
        {
            throw new ArgumentException("You already have a project with this name!");
        }

        var newProject = new Project
        {
            Title = request.Title,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };
        _context.Projects.Add(newProject);

        var newMember = new ProjectMember
        {
            UserId = userId,
            Role = "Manager",
            ProjectId = newProject.ProjectId
        };
        _context.ProjectMembers.Add(newMember);

        await _context.SaveChangesAsync();

        return new GetProjectRequest
        {
            ProjectId = newProject.ProjectId,
            Title = newProject.Title,
            CreatedAt = newProject.CreatedAt,
            Role = "Manager",
            AuthorName = user.Identity?.Name ?? "Unknown"
        };
    }

    public async Task<bool> DeleteProjectAsync(Guid projectId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != userId)
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        project.IsDeleted = true;
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> UpdateProjectAsync(Guid projectId, UpdateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != userId)
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        project.Title = request.Title;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<(List<GetProjectRequest> Data, int TotalCount)> GetProjectsByUserIdAsyncWithDapper(Guid userId, int pageNumber = 1, int pageSize = 9, string? searchTerm = null)
    {
        int offset = (pageNumber - 1) * pageSize;
        string? formattedSearch = string.IsNullOrWhiteSpace(searchTerm) ? null : $"%{searchTerm}%";
        var sql = @"
            SELECT COUNT(*)
            FROM ""Projects"" p
            INNER JOIN ""ProjectMembers"" pm ON p.""project_id"" = pm.""ProjectId""
            WHERE pm.""UserId"" = @UserId 
            AND p.""IsDeleted"" = FALSE
            " + (formattedSearch != null ?
            "AND p.\"Title\" ILIKE @SearchTerm" : "") + @";

            SELECT p.""project_id"" AS ProjectId, p.""ProjectName"" AS Title, p.""created_at"" AS CreatedAt, pm.""Role"" AS Role, u.""Username"" AS AuthorName
            FROM ""Projects"" p
            INNER JOIN ""ProjectMembers"" pm ON p.""project_id"" = pm.""ProjectId""
            LEFT JOIN ""Users"" u ON p.""CreatedBy"" = u.""UserId""
            WHERE pm.""UserId"" = @UserId 
            AND p.""IsDeleted"" = FALSE
            -- Nếu @SearchTerm truyền vào là NULL hoặc rỗng thì bỏ qua, ngược lại thì lọc theo Title
            AND (@SearchTerm IS NULL OR @SearchTerm = '' OR p.""Title"" ILIKE @SearchTerm)
            ORDER BY p.""created_at"" DESC
            LIMIT @PageSize OFFSET @Offset;";

        var parameters = new
        {
            UserId = userId,
            SearchTerm = formattedSearch,
            PageSize = pageSize,
            Offset = offset
        };

        var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();

        using var multi = await connection.QueryMultipleAsync(sql, parameters);

        int totalCount = await multi.ReadFirstAsync<int>();

        var projects = (await multi.ReadAsync<GetProjectRequest>()).ToList();

        return (projects, totalCount);
    }

    public async Task<List<UserMemberDto>> GetMembersByProjectIdAsync(Guid projectId)
    {
        string sql = @"
        SELECT 
            u.""UserId"" AS ""userId"",
            u.""Username"" AS ""username"",
            u.""AvatarUrl"" AS ""avatarUrl"",
            pm.""Role"" AS ""role""
        FROM ""ProjectMembers"" pm
        INNER JOIN ""Users"" u ON pm.""UserId"" = u.""UserId""
        WHERE pm.""ProjectId"" = @ProjectId;
        ";

        var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();

        var members = await connection.QueryAsync<UserMemberDto>(sql, new { ProjectId = projectId });
        return members.ToList();
    }

    public async Task<bool> AddMemberToProjectAsync(Guid projectId, Guid memberId, ClaimsPrincipal user)
    {
        var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();
        var ownerId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != ownerId) // Kiểm tra chủ sở hữu và tồn tại
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        if (_context.ProjectMembers.Any(pm => pm.ProjectId == projectId && pm.UserId == memberId))
        { // Kiểm tra đã có trong project chưa
            throw new ArgumentException("Member is already in the project!");
        }
        var newMember = new ProjectMember
        {
            UserId = memberId,
            Role = "Member",
            ProjectId = projectId
        };
        _context.ProjectMembers.Add(newMember);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveMemberFromProjectAsync(Guid projectId, Guid memberId, ClaimsPrincipal user)
    {
        var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();
        var ownerId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != ownerId) //Kiểm tra có phải chủ sở hữu và tồn tại không
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        var member = await _context.ProjectMembers.FindAsync(projectId, memberId) ?? throw new ArgumentException("Member is not exist in the project!");
        _context.ProjectMembers.Remove(member);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<(List<GetProjectRequest> Data, int TotalCount)> GetProjectsByUserIdAsync(Guid userId,
        int pageNumber = 1,
        int pageSize = 9,
        string? searchTerm = null)
    {
        var query = _context.Projects
            .Where(p => !p.IsDeleted && p.ProjectMembers.Any(pm => pm.UserId == userId));

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            // Với PostgreSQL, ông có thể dùng EF.Functions.ILike để tìm kiếm không phân biệt hoa thường
            query = query.Where(p => p.Title.Contains(searchTerm));
        }

        int totalCount = await query.CountAsync();

        var projectDtos = await _context.Projects
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .Where(p => !p.IsDeleted && p.ProjectMembers.Any(pm => pm.UserId == userId))
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var projects = projectDtos.Select(p => new GetProjectRequest
        {
            ProjectId = p.ProjectId,
            Title = p.Title,
            CreatedAt = p.CreatedAt,
            Role = p.ProjectMembers.FirstOrDefault(pm => pm.UserId == userId)?.Role ?? "Member",
            NumberOfMembers = GetMembersByProjectIdAsync(p.ProjectId).Result.Count,
            AuthorName = p.User?.Username ?? "Unknown",
        }).ToList();
        foreach (var project in projects)
        {
            project.MemberCount = (await GetMembersByProjectIdAsync(project.ProjectId)).Count;
        }
        return (projects, totalCount);
    }
    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token does not contain a valid UserId!");
        }
        return userId;
    }
}
