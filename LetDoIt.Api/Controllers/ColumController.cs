using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetColumns(Guid userId)
        {
            var columns = await _service.GetColumnsByUserIdAsync(userId);
            return Ok(columns);
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> CreateColumn(CreateColumnRequest request)
        {
            var column = await _service.CreateColumnAsync(request, User);
            if (column is null) return BadRequest("Could not create column.");
            return CreatedAtAction(nameof(GetColumns), new { userId = column.UserId }, column);
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
        [HttpPut("{id}/position")]
        public async Task<IActionResult> ChangeColumnPosition(Guid id, [FromQuery] int newPosition)
        {
            var changed = await _service.ChangeColumnPositionAsync(id, newPosition, User);
            if (!changed) return NotFound("Could not find column with specified ID for the user.");
            return NoContent();
        }
    }
}
