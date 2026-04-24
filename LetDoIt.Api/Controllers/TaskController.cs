using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Mvc;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _service;
        public TaskController(ITaskService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<GetTaskResponse>>> GetTasks()
            => Ok(await _service.GetAllTasksAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Task?>> GetTaskById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task is null) return NotFound("Khong the tim thay task voi Id chi dinh");
            return Ok(task);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<Models.Task?>> GetTaskByUserId(int userId)
        {
            var tasks = await _service.GetTaskByUserId(userId);
            if (tasks is null) return NotFound("Khong the tim thay task voi UserId chi dinh");
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<ActionResult<Models.Task>> CreateTask(Models.Task task)
        {
            var createdTask = await _service.CreateTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.TaskId }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(int id, UpdateTaskRequest task)
        {
            var updated = await _service.UpdateTaskAsync(id, task);
            if (!updated) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var deleted = await _service.DeleteTaskAsync(id);
            if (!deleted) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        // Accept priority in the request body as JSON. If omitted (null) service will auto-calculate.
        [HttpPut("{id}/priority")]
        public async Task<ActionResult> ChangePriority(int id, [FromBody] ChangePriorityRequest? request)
        {
            var changed = await _service.ChangePriority(id, request?.Priority);
            if (!changed) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }
    }
}