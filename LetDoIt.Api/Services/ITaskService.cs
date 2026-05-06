using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Security.Claims;
namespace LetDoIt.Api.Services

{
    public interface ITaskService
    {
        Task<List<GetTaskResponse>> GetAllTasksAsync();
        Task<GetTaskResponse?> GetTaskByIdAsync(Guid taskId);
        Task<Models.Task> CreateTaskAsync(Models.Task task, ClaimsPrincipal user);
        Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest task);
        Task<bool> DeleteTaskAsync(Guid taskId);
        Task<List<GetTaskResponse>> GetTasksByUserId(Guid userId);
        Task<bool> UpdateStatusAsync(Guid taskId, string status);
        Task<bool> ChangePriority(Guid taskId, Priority? priority);
        Task<List<GetTaskResponse>> GetTasksByCategoryIdAsync(Guid categoryId);
        Task<List<GetTaskResponse>> GetMyTask(ClaimsPrincipal user);
    }
}
