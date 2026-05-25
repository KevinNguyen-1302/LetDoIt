using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LetDoIt.Api.Models;
using LetDoIt.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace LetDoIt.Api.Services;

public class TaskService : ITaskService
{
    private readonly LetDoItContext _context;
    public TaskService(LetDoItContext context)
    {
        _context = context;
    }

    public async Task<bool> ChangePriority(Guid taskId, Priority? newPriority = null)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task == null) return false;

        // Logic: Nếu user truyền priority vào thì dùng, nếu null thì tự tính
        if (newPriority.HasValue)
        {
            task.Priority = newPriority.Value;
        }
        else
        {
            task.Priority = CalculatePriority(task.DueDate);
        }

        await _context.SaveChangesAsync();
        return true;
    }

    private Priority CalculatePriority(DateTime dueDate)
    {
        // ✅ Đảm bảo dueDate là UTC trước khi so sánh
        if (dueDate.Kind != DateTimeKind.Utc)
        {
            dueDate = dueDate.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(dueDate, DateTimeKind.Utc)
                : dueDate.ToUniversalTime();
        }

        var now = DateTime.UtcNow;
        var daysRemaining = (dueDate - now).TotalDays;
        Console.WriteLine($"DEBUG: Hiện tại là {now}, DueDate là {dueDate}, còn lại {daysRemaining} ngày");
        if (daysRemaining <= 1) return Priority.Urgent;        // Sát nút (trong 24h)
        else if (daysRemaining <= 3) return Priority.High;     // Sắp tới (trong 3 ngày)
        else if (daysRemaining <= 7) return Priority.Medium;   // Sắp tới (trong 1 tuần)
        else return Priority.Low;                              // Còn xa
    }

    public async Task<Models.Task> CreateTaskAsync(Models.Task task, ClaimsPrincipal user)
    {
        // Extract user ID from claims
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
        }


        var dueDate = task.DueDate;
        if (dueDate.Kind == DateTimeKind.Unspecified)
        {
            dueDate = DateTime.SpecifyKind(dueDate, DateTimeKind.Utc);
        }
        else if (dueDate.Kind == DateTimeKind.Local)
        {
            dueDate = dueDate.ToUniversalTime();
        }

        if (dueDate < DateTime.UtcNow)
        {
            throw new ArgumentException("Due date must be in the future!");
        }

        var columnId = _context.Columns
            .Where(c => c.ColumnId == task.ColumnId && c.Title.ToLower() == "pending")
            .Select(c => c.ColumnId)
            .FirstOrDefault();

        // Assign user ID to the task
        var newTask = new Models.Task
        {
            Title = task.Title,
            Description = task.Description,
            DueDate = dueDate,
            IsCompleted = task.IsCompleted,
            Priority = task.Priority != 0 ? task.Priority : CalculatePriority(dueDate),
            Visibility = task.Visibility,
            UserId = userId,
            ColumnId = columnId
        };
        if (dueDate < DateTime.UtcNow)
        {
            throw new ArgumentException("Due date must be in the future!");
        }
        _context.Tasks.Add(newTask);
        await _context.SaveChangesAsync();

        return newTask;
    }

    public async Task<bool> DeleteTaskAsync(Guid taskId)
    {
        var existingTask = await GetTaskByIdAsync(taskId);


        if (existingTask == null) return false;
        _context.Tasks.Remove(new Models.Task { TaskId = taskId });
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }


    public async Task<GetTaskResponse?> GetTaskByIdAsync(Guid taskId)
    {
        var result = await _context.Tasks
            .Where(t => t.TaskId == taskId)
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = t.Visibility,
            })
            .FirstOrDefaultAsync();
        return result;

    }

    public async Task<List<GetTaskResponse>> GetTasksByUserId(Guid userId)
    {
        return await _context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = t.Visibility
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest task, ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
        }

        var existingTask = await _context.Tasks.FindAsync(taskId);
        if (existingTask == null)
        {
            return false;
        }

        // ✅ Đảm bảo DueDate là UTC
        var dueDate = task.DueDate;
        if (dueDate.HasValue)
        {
            if (dueDate.Value.Kind == DateTimeKind.Unspecified)
            {
                dueDate = DateTime.SpecifyKind(dueDate.Value, DateTimeKind.Utc);
            }
            else if (dueDate.Value.Kind == DateTimeKind.Local)
            {
                dueDate = dueDate.Value.ToUniversalTime();
            }
        }

        // Map dữ liệu
        existingTask.Title = task.Title ?? existingTask.Title;
        existingTask.Description = task.Description ?? existingTask.Description;
        existingTask.DueDate = dueDate ?? existingTask.DueDate;
        existingTask.IsCompleted = task.IsCompleted ?? existingTask.IsCompleted;
        existingTask.Priority = task.Priority != null ? (Priority)task.Priority : existingTask.Priority;
        existingTask.Visibility = task.Visibility ?? existingTask.Visibility;
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LỖI UPDATE TASK]: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"[CHI TIẾT]: {ex.InnerException.Message}");
            }
            return false;
        }
    }

    public Task<List<GetTaskResponse>> GetTasksByCategoryIdAsync(Guid categoryId)
    {
        throw new NotImplementedException();
    }


    public async Task<List<GetTaskResponse>> GetMyTask(ClaimsPrincipal user)
    {
        // Extract user ID from claims
        var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (currentUserId == null || !Guid.TryParse(currentUserId, out var userId))
        {
            throw new UnauthorizedAccessException("Token không hợp lệ hoặc thiếu thông tin định danh.");
        }

        // Query DB based on token ID
        var tasks = await _context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                ColumnId = t.ColumnId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = t.Visibility
            })
            .OrderBy(t => t.DueDate) // Sắp xếp theo DueDate tăng dần
            .ToListAsync();

        return tasks;
    }

    public async Task<bool> MoveTask(Guid taskId, Guid newColumnId, ClaimsPrincipal user)
    {
        var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (currentUserId == null || !Guid.TryParse(currentUserId, out var userId))
        {
            throw new UnauthorizedAccessException("Token không hợp lệ hoặc thiếu thông tin định danh.");
        }
        var existingTask = await _context.Tasks.FindAsync(taskId);
        if (existingTask == null) return false;

        existingTask.ColumnId = newColumnId;

        var targetColumn = await _context.Columns.FindAsync(newColumnId);

        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LỖI MOVE TASK]: {ex.Message}");
            return false;
        }
    }

    public Task<List<GetTaskResponse>> GetTasksByDueDateAsync(DateTime dueDate, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        if (dueDate.Kind == DateTimeKind.Unspecified)
        {
            dueDate = DateTime.SpecifyKind(dueDate, DateTimeKind.Utc);
        }
        else if (dueDate.Kind == DateTimeKind.Local)
        {
            dueDate = dueDate.ToUniversalTime();
        }
        return _context.Tasks
            .Where(t => t.UserId == userId && t.DueDate.Date == dueDate.Date)
            .Select(t => new GetTaskResponse
            {
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = t.Visibility
            })
            .ToListAsync();
    }

    public Task<List<GetTaskResponse>> GetTasksByVisibilityAsync(string visibility)
    {
        throw new NotImplementedException();
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
