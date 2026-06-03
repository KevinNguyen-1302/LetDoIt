using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LetDoIt.Api.Response;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController(IAuthService authService) : ControllerBase
    {
        public static Users user = new();

        [HttpPost]
        public async Task<ActionResult<Users>> Register(RegisterRequest request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest("Username or email already exists.");
            }
            return CreatedAtAction(nameof(Login), new { username = request.Username }, user);
        }

        [HttpPost]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginRequest request)
        {
            var result = await authService.LoginAsync(request);
            if (result is null)
            {
                return BadRequest("Invalid username or password.");
            }
            return Ok(result);
        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated!");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> Get()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid user ID.");
            }

            var user = await authService.GetUserByIdAsync(userId);
            if (user is null)
            {
                return NotFound("User not found.");
            }

            return Ok(new UserDto { UserId = user.UserId, Username = user.Username, Email = user.Email });
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<ActionResult<List<UserDto>>> GetByUsername(string username)
        {
            var users = await authService.GetUserByUsernameAsync(username);
            if (users == null || !users.Any())
            {
                return NotFound("User not found.");
            }

            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokenAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
            {
                return BadRequest("Invalid refresh token.");
            }
            return Ok(result);
        }
    }
}
