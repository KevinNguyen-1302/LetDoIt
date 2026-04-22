using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

        if (existingTask == null)
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

    public async Task<List<Models.Task>> GetAllTasksAsync()
    {
        return await _context.Tasks.ToListAsync();
    }

    public async Task<Models.Task?> GetTaskByIdAsync(int taskId)
    {
        return await _context.Tasks.FirstOrDefaultAsync(t => t.TaskId == taskId);
    }

    public async Task<List<Models.Task>> GetTaskByUserId(int userId)
    {
        return await _context.Tasks.Where(t => t.UserId == userId).ToListAsync();
    }

    public async Task<bool> UpdateTaskAsync(int taskId, Models.Task task)
    {
        var existingTask = await GetTaskByIdAsync(taskId);

        if (existingTask == null) return false;

        existingTask.Title = task.Title;
        existingTask.Description = task.Description;
        existingTask.DueDate = task.DueDate;
        existingTask.IsCompleted = task.IsCompleted;
        existingTask.Priority = task.Priority;
        existingTask.Status = task.Status;
        existingTask.Visibility = task.Visibility;
        existingTask.CategoryId = task.CategoryId;
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
}
