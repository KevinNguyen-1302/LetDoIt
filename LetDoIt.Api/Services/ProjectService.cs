using System.Security.Claims;
using LetDoIt.Api.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;

namespace LetDoIt.Api.Services;

public class ProjectService(LetDoItContext context) : IProjectService
{
    private readonly LetDoItContext _context = context;

    public async Task<bool> ChangeProjectAuthorAsync(Guid projectId, Guid newAuthorId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != userId)
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        project.UserId = newAuthorId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<GetProjectRequest> CreateProjectAsync(CreateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        if (await _context.Projects.AnyAsync(p => p.Title.Equals(request.Title) && p.UserId == userId))
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
            Role = "Manager"
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
            .OrderByDescending(p => p.CreatedAt)
            .Where(p => p.ProjectMembers.Any(pm => pm.UserId == userId))
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(); 

        var projects = projectDtos.Select(p => new GetProjectRequest
        {
            ProjectId = p.ProjectId,
            Title = p.Title,
            CreatedAt = p.CreatedAt,
            Role = p.ProjectMembers.FirstOrDefault(pm => pm.UserId == userId)?.Role ?? "Member", 
            NumberOfMembers = p.ProjectMembers.Count
        }).ToList();

        return (projects, totalCount);
    }



    public async Task<bool> UpdateProjectAsync(Guid projectId, UpdateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var project = await _context.Projects.FindAsync(projectId);
        if (project == null || project.UserId != userId)
        {
            throw new ArgumentException("Project is not exist or you are not the owner!");
        }
        project.Title = request.Name;
        await _context.SaveChangesAsync();
        return true;
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

            SELECT p.""project_id"", p.""ProjectName"", p.""created_at"", pm.""Role""
            FROM ""Projects"" p
            INNER JOIN ""ProjectMembers"" pm ON p.""project_id"" = pm.""ProjectId""
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

        using var connection = _context.Database.GetDbConnection();
        if (connection.State == ConnectionState.Closed)
            await connection.OpenAsync();

        using var multi = await connection.QueryMultipleAsync(sql, parameters);

        int totalCount = await multi.ReadFirstAsync<int>();

        var projects = (await multi.ReadAsync<GetProjectRequest>()).ToList();

        return (projects, totalCount);
    }
}
