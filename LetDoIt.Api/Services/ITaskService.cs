using LetDoIt.Api.DTOs;
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
    }
}
