using LetDoIt.Api.Models;
namespace LetDoIt.Api.Services
{
    public interface ITaskService
    {
        Task<List<Models.Task>> GetAllTasksAsync(); 
        Task<Models.Task?> GetTaskByIdAsync(int taskId);
        Task<Models.Task> CreateTaskAsync(Models.Task task);
        Task<bool> UpdateTaskAsync(int taskId, Models.Task task);
        Task<bool> DeleteTaskAsync(int taskId);
        Task<List<Models.Task?>> GetTaskByUserId(int userId);
    }
}
