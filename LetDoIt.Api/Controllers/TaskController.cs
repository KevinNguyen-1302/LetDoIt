using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly LetDoItContext _context;
        public TaskController(LetDoItContext context)
        {
            _context = context;
        }

        //static List<Models.Task> tasks = new List<Models.Task>
        //{
        //        new Models.Task { TaskId = 1, Title = "Task 1", Description = "Description for Task 1", IsCompleted = false },
        //        new Models.Task { TaskId = 2, Title = "Task 2", Description = "Description for Task 2", IsCompleted = true },
        //        new Models.Task { TaskId = 3, Title = "Task 3", Description = "Description for Task 3", IsCompleted = false },
        //};

        [HttpPost]
        public async Task<ActionResult<Models.Task>> CreateTask(Models.Task task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTasks), new { id = task.TaskId }, task);
        }

        [HttpGet]
        public async Task<ActionResult<List<Models.Task>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync<Models.Task>();
            return Ok(tasks);
        }
    }
}
