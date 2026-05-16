using System;
using System.Security.Claims;
using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
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
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId && c.UserId == userId);
        if (column == null)
        {
            return false;
        }
        column.Position = newPosition;
        try
        {
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
        var newColumn = new Column
        {
            Title = request.Title,
            Position = request.Position,
            UserId = userId
        };
        context.Columns.Add(newColumn);
        await context.SaveChangesAsync();
        return newColumn;
    }

    public async Task<bool> DeleteColumnAsync(Guid columnId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId && c.UserId == userId);
        if (column == null)
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
        var column = await context.Columns.FirstOrDefaultAsync(c => c.ColumnId == columnId && c.UserId == userId);

        if (column == null)
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
    private static Guid GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
        }
        return userId;
    }

    public async Task<List<Column>> GetColumnsByUserIdAsync(Guid userId)
    {
        return await context.Columns.Where(c => c.UserId == userId).ToListAsync();
    }
}
