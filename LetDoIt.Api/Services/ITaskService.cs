using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
namespace LetDoIt.Api.Services

{
    public interface ITaskService
    {
        Task<List<GetTaskResponse>> GetAllTasksAsync();
        Task<GetTaskResponse?> GetTaskByIdAsync(Guid taskId);
        Task<Models.Task> CreateTaskAsync(Models.Task task);
        Task<bool> UpdateTaskAsync(Guid taskId, UpdateTaskRequest task);
        Task<bool> DeleteTaskAsync(Guid taskId);
        Task<List<GetTaskResponse>> GetTaskByUserId(Guid userId);
        Task<bool> UpdateStatusAsync(Guid taskId, string status);
        Task<bool> ChangePriority(Guid taskId, Priority? priority);
    }
}
