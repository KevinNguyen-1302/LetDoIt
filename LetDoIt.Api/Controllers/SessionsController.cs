using LetDoIt.Api.DTOs;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _service;
        public SessionsController(ISessionService service) => _service = service;
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> SaveSession([FromBody] CreateSessionRequestDto request)
        {
            try
            {
                var savedSession = await _service.SaveCompletedSessionAsync(request, User);
                return Ok(savedSession);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message); // Trả về 403 nếu cố tình truyền TaskId của người khác
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
