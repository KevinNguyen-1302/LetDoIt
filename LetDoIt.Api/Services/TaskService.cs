using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LetDoIt.Api.Models;
using LetDoIt.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace LetDoIt.Api.Services;

public class TaskService(LetDoItContext context) : ITaskService
{
    private readonly LetDoItContext _context = context;
    private static readonly string[] TaskWriteRoles = ["Manager"];

    public async Task<bool> ChangePriority(Guid taskId, ClaimsPrincipal user, Priority? newPriority = null)
    {
        var userId = GetUserId(user);
        var task = await _context.Tasks
            .Include(t => t.Column)
            .FirstOrDefaultAsync(t => t.TaskId == taskId);
        if (task == null) return false;

        if (!await UserCanUpdateTaskAsync(userId, task))
        {
            return false;
        }

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

    public async Task<Models.Task> CreateTaskAsync(CreateTaskRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        var dueDate = request.DueDate;
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

        if (request.ColumnId != Guid.Empty)
        {
            var column = await _context.Columns.FirstOrDefaultAsync(c => c.ColumnId == request.ColumnId);

            if (column == null || !await UserCanCreateTaskAsync(userId, column.ProjectId))
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thêm task vào project này.");
            }
        }

        var taskToInsert = new Models.Task
        {
            TaskId = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            DueDate = dueDate,
            IsCompleted = request.IsCompleted,
            Priority = (Priority)request.Priority,
            Visibility = (Visibility)request.Visibility,
            CreatedBy = userId,
            ColumnId = request.ColumnId != Guid.Empty ? request.ColumnId : null,
            AssigneeId = request.AssigneeId != Guid.Empty ? request.AssigneeId : null
        };

        _context.Tasks.Add(taskToInsert);
        await _context.SaveChangesAsync();

        return taskToInsert;
    }

    public async Task<bool> DeleteTaskAsync(Guid taskId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var existingTask = await _context.Tasks
            .Include(t => t.Column)
            .FirstOrDefaultAsync(t => t.TaskId == taskId);
        if (existingTask == null) return false;

        if (!await UserCanDeleteTaskAsync(userId, existingTask))
        {
            return false;
        }

        _context.Tasks.Remove(existingTask);
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
                Visibility = (int)t.Visibility,
                AssigneeId = t.AssigneeId,
                AssigneeName = t.Assignee != null ? t.Assignee.Username : null,
                AssigneeAvatarUrl = t.Assignee != null ? t.Assignee.AvatarUrl : null
            })
            .FirstOrDefaultAsync();
        return result;

    }

    public async Task<List<GetTaskResponse>> GetTasksByUserId(Guid userId)
    {
        return await _context.Tasks
            .Where(t => t.CreatedBy == userId || t.AssigneeId == userId)
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = (int)t.Visibility,
                AssigneeId = t.AssigneeId,
                AssigneeName = t.Assignee != null ? t.Assignee.Username : null,
                AssigneeAvatarUrl = t.Assignee != null ? t.Assignee.AvatarUrl : null
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest task, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        var existingTask = await _context.Tasks
            .Include(t => t.Column)
            .FirstOrDefaultAsync(t => t.TaskId == taskId);
        if (existingTask == null)
        {
            return false;
        }

        if (!await UserCanUpdateTaskAsync(userId, existingTask))
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
        existingTask.Visibility = task.Visibility != null ? (Visibility)task.Visibility : existingTask.Visibility;
        existingTask.AssigneeId = task.AssigneeId != null ? task.AssigneeId : existingTask.AssigneeId;
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
            .Where(t => t.CreatedBy == userId || t.AssigneeId == userId)
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                ColumnId = t.ColumnId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = (int)t.Visibility,
                AssigneeId = t.AssigneeId,
                AssigneeName = t.Assignee != null ? t.Assignee.Username : null,
                AssigneeAvatarUrl = t.Assignee != null ? t.Assignee.AvatarUrl : null
            })
            .OrderBy(t => t.DueDate) // Sắp xếp theo DueDate tăng dần
            .ToListAsync();

        return tasks;
    }

    public async Task<bool> MoveTask(Guid taskId, Guid newColumnId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);

        var existingTask = await _context.Tasks
            .Include(t => t.Column)
            .FirstOrDefaultAsync(t => t.TaskId == taskId);
        if (existingTask == null) return false;

        var targetColumn = await _context.Columns.FirstOrDefaultAsync(c => c.ColumnId == newColumnId);
        if (targetColumn == null)
        {
            return false;
        }

        if (!await UserCanMoveTaskAsync(userId, existingTask, targetColumn.ProjectId))
        {
            return false;
        }

        existingTask.ColumnId = newColumnId;

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
            .Where(t => t.CreatedBy == userId || t.AssigneeId == userId && t.DueDate.Date == dueDate.Date)
            .Select(t => new GetTaskResponse
            {
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = (int)t.Visibility,
                AssigneeId = t.AssigneeId,
                AssigneeName = t.Assignee != null ? t.Assignee.Username : null,
                AssigneeAvatarUrl = t.Assignee != null ? t.Assignee.AvatarUrl : null
            })
            .ToListAsync();
    }

    public async Task<List<GetTaskResponse>> GetTasksByProjectIdAsync(Guid projectId, ClaimsPrincipal user)
    {
        var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (currentUserId == null || !Guid.TryParse(currentUserId, out var userId))
        {
            throw new UnauthorizedAccessException("Token không hợp lệ hoặc thiếu thông tin định danh.");
        }

        // Kiểm tra xem user có phải là member của project không
        var isMember = await _context.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);

        if (!isMember)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập project này.");
        }

        // Lấy tất cả tasks thuộc các column của project mà user có quyền xem (Public, Creator, hoặc Assignee)
        var tasks = await _context.Tasks
            .Where(t => t.Column != null
                && t.Column.ProjectId == projectId
                && (t.Visibility == Visibility.Public || t.CreatedBy == userId || t.AssigneeId == userId))
            .Select(t => new GetTaskResponse
            {
                TaskId = t.TaskId,
                ColumnId = t.ColumnId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = (int)t.Priority,
                Visibility = (int)t.Visibility,
                AssigneeId = t.AssigneeId,
                AssigneeName = t.Assignee != null ? t.Assignee.Username : null,
                AssigneeAvatarUrl = t.Assignee != null ? t.Assignee.AvatarUrl : null
            })
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        return tasks;
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

    private Task<bool> UserCanCreateTaskAsync(Guid userId, Guid projectId)
    {
        return UserHasProjectRoleAsync(userId, projectId, TaskWriteRoles);
    }

    private async Task<bool> UserCanUpdateTaskAsync(Guid userId, Models.Task task)
    {
        if (task.ColumnId == null || task.Column == null)
        {
            return task.CreatedBy == userId;
        }

        return await UserHasProjectRoleAsync(userId, task.Column.ProjectId, TaskWriteRoles);
    }

    private async Task<bool> UserCanDeleteTaskAsync(Guid userId, Models.Task task)
    {
        if (task.ColumnId == null || task.Column == null)
        {
            return task.CreatedBy == userId;
        }

        return await UserHasProjectRoleAsync(userId, task.Column.ProjectId, TaskWriteRoles);
    }

    private async Task<bool> UserCanMoveTaskAsync(Guid userId, Models.Task task, Guid targetProjectId)
    {
        var canAccessCurrentProject = task.ColumnId == null || task.Column == null
            ? task.CreatedBy == userId
            : await UserHasProjectRoleAsync(userId, task.Column.ProjectId, TaskWriteRoles);

        if (!canAccessCurrentProject)
        {
            return false;
        }

        return await UserHasProjectRoleAsync(userId, targetProjectId, TaskWriteRoles);
    }

    private async Task<bool> UserHasProjectRoleAsync(Guid userId, Guid projectId, params string[] allowedRoles)
    {
        return await _context.ProjectMembers.AnyAsync(pm =>
            pm.ProjectId == projectId
            && pm.UserId == userId
            && allowedRoles.Contains(pm.Role));
    }


}
