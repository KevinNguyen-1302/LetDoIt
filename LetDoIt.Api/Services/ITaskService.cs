using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Security.Claims;
namespace LetDoIt.Api.Services

{
    public interface ITaskService
    {
        Task<GetTaskResponse?> GetTaskByIdAsync(Guid taskId);
        Task<Models.Task> CreateTaskAsync(CreateTaskRequest request, ClaimsPrincipal user);
        Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest task, ClaimsPrincipal user);
        Task<bool> DeleteTaskAsync(Guid taskId);
        Task<List<GetTaskResponse>> GetTasksByUserId(Guid userId);
        Task<bool> ChangePriority(Guid taskId, Priority? priority);
        Task<List<GetTaskResponse>> GetMyTask(ClaimsPrincipal user);
        Task<bool> MoveTask(Guid taskId, Guid newColumnId, ClaimsPrincipal user);
        Task<List<GetTaskResponse>> GetTasksByDueDateAsync(DateTime dueDate, ClaimsPrincipal user);
        Task<List<GetTaskResponse>> GetTasksByVisibilityAsync(string visibility);
    }
}
