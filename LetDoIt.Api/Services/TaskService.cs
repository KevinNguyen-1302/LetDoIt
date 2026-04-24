using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using LetDoIt.Api.Models;
using LetDoIt.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using System;

namespace LetDoIt.Api.Services;

public class TaskService : ITaskService
{
    private readonly LetDoItContext _context;
    public TaskService(LetDoItContext context)
    {
        _context = context;
    }
    public async Task<Models.Task> CreateTaskAsync(Models.Task task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> DeleteTaskAsync(int taskId)
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

    public async Task<List<GetTaskResponse>> GetAllTasksAsync()
    {
        return await _context.Tasks
            .Select(t => new GetTaskResponse
            {
                CategoryId = t.CategoryId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Status = t.Status,
                Visibility = t.Visibility
            })
            .ToListAsync();
    }

    public async Task<GetTaskResponse?> GetTaskByIdAsync(int taskId)
    {
        var result = await _context.Tasks
            .Where(t => t.TaskId == taskId)
            .Select(t => new GetTaskResponse
            {
                CategoryId = t.CategoryId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Status = t.Status,
                Visibility = t.Visibility
            })
            .FirstOrDefaultAsync();
        return result;

    }

    public async Task<List<GetTaskResponse>> GetTaskByUserId(int userId)
    {
        return await _context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new GetTaskResponse
            {
                CategoryId = t.CategoryId,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted,
                Priority = t.Priority,
                Status = t.Status,
                Visibility = t.Visibility
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateTaskAsync(int taskId, UpdateTaskRequest task)
    {
        Console.WriteLine($"Đang update Task {taskId} với Title mới là: {task.Title}");
        var existingTask = await _context.Tasks.FindAsync(taskId);
        if (existingTask == null)
        {return false;}
        else
        {
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.DueDate = task.DueDate;
            existingTask.IsCompleted = task.IsCompleted;
            existingTask.Priority = task.Priority;
            existingTask.Status = task.Status;
            existingTask.Visibility = task.Visibility;
            existingTask.CategoryId = task.CategoryId;
        }
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
}
