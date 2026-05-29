using System;
using System.Security.Claims;
using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetsDoIt.Models;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Services;

public class ColumnService : IColumnService
{
    readonly LetDoItContext context;
    private readonly string _connectionString;


    public ColumnService(LetDoItContext context)
    {
        this.context = context;
        this._connectionString = context.Database.GetDbConnection().ConnectionString;
    }

    public async Task<bool> ChangeColumnPositionAsync(Guid columnId, int newPosition, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId);
        if (column == null)
        {
            return false;
        }

        // Kiểm tra user có quyền truy cập project không
        if (!await UserCanAccessProjectAsync(userId, column.ProjectId))
        {
            return false;
        }

        try
        {
            // Get all columns of this project
            var projectId = column.ProjectId;
            var allColumns = await context.Columns
                .Where(c => c.ProjectId == projectId)
                .OrderBy(c => c.Position)
                .ToListAsync();

            allColumns.Remove(column);
            allColumns.Insert(newPosition, column);
            for (int i = 0; i < allColumns.Count; i++)
            {
                allColumns[i].Position = i;
            }

            await context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LỖI CHANGE COLUMN POSITION]: {ex.Message}");
            return false;
        }
    }

    public async Task<Column?> CreateColumnAsync(CreateColumnRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        // Kiểm tra user có quyền truy cập project không
        if (!await UserCanAccessProjectAsync(userId, request.ProjectId))
        {
            return null;
        }

        var maxPosition = await context.Columns
            .Where(c => c.ProjectId == request.ProjectId)
                .Select(c => (int?)c.Position) // Ép kiểu nullable để tránh lỗi nếu chưa có dòng nào
                .MaxAsync() ?? 0;

        var newPosition = maxPosition + 1;

        var newColumn = new Column
        {
            Title = request.Title,
            Position = newPosition,
            ProjectId = request.ProjectId
        };
        context.Columns.Add(newColumn);
        await context.SaveChangesAsync();
        return newColumn;
    }

    public async Task<bool> DeleteColumnAsync(Guid columnId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId);
        
        if (column == null)
        {
            return false;
        }

        // Kiểm tra user có quyền truy cập project không
        if (!await UserCanAccessProjectAsync(userId, column.ProjectId))
        {
            return false;
        }

        context.Columns.Remove(column);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateColumnAsync(Guid columnId, UpdateColumnRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId);

        if (column == null)
        {
            return false;
        }

        // Kiểm tra user có quyền truy cập project không
        if (!await UserCanAccessProjectAsync(userId, column.ProjectId))
        {
            return false;
        }

        column.Title = !string.IsNullOrWhiteSpace(request.Title) ? request.Title : column.Title;

        try
        {
            await context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LỖI UPDATE COLUMN]: {ex.Message}");
            return false;
        }
    }

    public async Task<List<Column>> GetColumnsByUserIdAsync(Guid userId)
    {
        // Lấy tất cả columns từ projects của user
        var columns = await context.Columns
            .Where(c => c.Project != null && c.Project.UserId == userId)
            .OrderBy(c => c.Position)
            .ToListAsync();
        
        return columns;
    }

    public async Task<List<Column>> GetColumnsByProjectIdAsync(Guid projectId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        // Kiểm tra user có quyền truy cập project không
        if (!await UserCanAccessProjectAsync(userId, projectId))
        {
            return new List<Column>();
        }

        var columns = await context.Columns
            .Where(c => c.ProjectId == projectId)
            .OrderBy(c => c.Position)
            .ToListAsync();

        return columns;
    }

    private async Task<bool> UserCanAccessProjectAsync(Guid userId, Guid projectId)
    {
        // Kiểm tra user có phải là owner của project
        var project = await context.Projects
            .FirstOrDefaultAsync(p => p.ProjectId == projectId && p.UserId == userId);
        
        return project != null;
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
        }
        return userId;
    }
}
