using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
namespace LetDoIt.Api.Services

{
    public interface ITaskService
    {
        Task<List<GetTaskResponse>> GetAllTasksAsync();
        Task<GetTaskResponse?> GetTaskByIdAsync(int taskId);
        Task<Models.Task> CreateTaskAsync(Models.Task task);
        Task<bool> UpdateTaskAsync(int taskId, UpdateTaskRequest task);
        Task<bool> DeleteTaskAsync(int taskId);
        Task<List<GetTaskResponse>> GetTaskByUserId(int userId);
        Task<bool> UpdateStatusAsync(int taskId, string status);
        Task<bool> ChangePriority(int taskId, Priority? priority);
    }
}
