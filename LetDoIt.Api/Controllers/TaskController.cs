using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Mvc;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _service;
        public TaskController(ITaskService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<List<GetTaskResponse>>> GetTasks()
            => Ok(await _service.GetAllTasksAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Task?>> GetTaskById(Guid id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task is null) return NotFound("Khong the tim thay task voi Id chi dinh");
            return Ok(task);
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<Models.Task?>> GetTasksByUserId(Guid userId)
        {
            var tasks = await _service.GetTasksByUserId(userId);
            if (tasks is null) return NotFound("Khong the tim thay task voi UserId chi dinh");
            return Ok(tasks);
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult<Models.Task>> CreateTask(Models.Task task)
        {
            var createdTask = await _service.CreateTaskAsync(task, User);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.TaskId }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(Guid id, UpdateTaskRequest task)
        {
            var updated = await _service.UpdateTaskAsync(id, task);
            if (!updated) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            var deleted = await _service.DeleteTaskAsync(id);
            if (!deleted) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        // Accept priority in the request body as JSON. If omitted (null) service will auto-calculate.
        [HttpPut("{id}")]
        public async Task<ActionResult> ChangePriority(Guid id, [FromBody] ChangePriorityRequest? request)
        {
            var changed = await _service.ChangePriority(id, request?.Priority);
            if (!changed) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }
        [Authorize(Roles = "User")]
        [HttpGet]
        public async Task<ActionResult<List<GetTaskResponse>>> GetMyTask()
        {
            var tasks = await _service.GetMyTask(User);
            return Ok(tasks);
        }
    }
}