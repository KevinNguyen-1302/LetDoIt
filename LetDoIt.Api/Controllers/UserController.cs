using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IAuthService authService) : ControllerBase
    {
        public static Users user = new ();

        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(RegisterRequest request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null) 
            {
                return BadRequest("Username or email already exists.");
            }
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(LoginRequest request)
        {
            var result = await authService.LoginAsync(request);
            if(result is null)
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

        [HttpPost("refresh-token")]
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
