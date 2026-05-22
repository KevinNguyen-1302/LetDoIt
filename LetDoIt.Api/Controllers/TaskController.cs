using LetDoIt.Api.DTOs;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        
        [Authorize(Roles = "User")]
        [HttpGet]
        public async Task<ActionResult<Models.Task?>> GetTasksByUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
                return BadRequest("Invalid user ID.");
                
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

        [Authorize(Roles = "User")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskRequest task)
        {
            var updated = await _service.UpdateTaskAsync(id, task, User);
            if (!updated) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        [Authorize(Roles = "User")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            var deleted = await _service.DeleteTaskAsync(id);
            if (!deleted) return NotFound("Khong the tim thay task voi Id chi dinh");
            return NoContent();
        }

        // Accept priority in the request body as JSON. If omitted (null) service will auto-calculate.
        [Authorize(Roles = "User")]
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

        [Authorize(Roles = "User")]
        [HttpPut("{id}")]
        public async Task<ActionResult> MoveTask(Guid id, [FromBody] MoveTaskRequest request)
        {
            var moved = await _service.MoveTask(id, request.NewColumnId, User);
            if (!moved) return NotFound("Khong the tim thay task voi Id chi dinh hoac ColumnId khong hop le");
            return NoContent();
        }
    }
}