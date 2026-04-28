using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
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
        public async Task<ActionResult<string>> Login(LoginRequest request)
        {
            var token = await authService.LoginAsync(request);
            if(token is null)
            {
                return BadRequest("Invalid username or password.");
            }
            return Ok(token);
        }

        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated!");
        }

    }
}
