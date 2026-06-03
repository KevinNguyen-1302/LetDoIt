using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using LetsDoIt.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ColumnController : ControllerBase
    {
        private readonly IColumnService _service;
        public ColumnController(IColumnService service) => _service = service;

        [Authorize(Roles = "User")]
        [HttpGet]
        public async Task<ActionResult<List<Column>>> GetColumns()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
                return BadRequest("Invalid user ID.");

            var columns = await _service.GetColumnsByUserIdAsync(userId);
            return Ok(columns);
        }

        [Authorize(Roles = "User")]
        [HttpGet("{projectId}")]
        public async Task<ActionResult<List<Column>>> GetColumnsByProject(Guid projectId)
        {
            var columns = await _service.GetColumnsByProjectIdAsync(projectId, User);
            return Ok(columns);
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> CreateColumn(CreateColumnRequest request)
        {
            var column = await _service.CreateColumnAsync(request, User);
            if (column is null) return BadRequest("Could not create column.");
            return CreatedAtAction(nameof(GetColumns), new { projectId = column.ProjectId }, column);
        }

        [Authorize(Roles = "User")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateColumn(Guid id, UpdateColumnRequest request)
        {
            var updated = await _service.UpdateColumnAsync(id, request, User);
            if (!updated) return NotFound("Could not find column with specified ID for the user.");
            return NoContent();
        }

        [Authorize(Roles = "User")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColumn(Guid id)
        {
            var deleted = await _service.DeleteColumnAsync(id, User);
            if (!deleted) return NotFound("Could not find column with specified ID for the user.");
            return NoContent();
        }

        [Authorize(Roles = "User")]
        [HttpPut]
        public async Task<IActionResult> ChangeColumnPosition([FromQuery] Guid columnId, [FromQuery] int newPosition)
        {
            var changed = await _service.ChangeColumnPositionAsync(columnId, newPosition, User);
            if (!changed) return NotFound("Could not find column with specified ID for the user.");
            return NoContent();
        }
    }
}
