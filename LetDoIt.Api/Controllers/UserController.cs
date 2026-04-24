using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using LetDoIt.Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public static Users user = new ();

        [HttpPost("register")]
        public ActionResult<Users> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new Users
            {
                Username = request.Username,
                Email = request.Email,
                DisplayName = request.DisplayName,
                Dob = DateOnly.FromDateTime(request.Dob),
                PhoneNumber = request.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            user.HashedPassword = new PasswordHasher<Users>().HashPassword(user, request.Password);

            return Ok(user);
        }

        //[HttpPost("login")]
        //public ActionResult<string> Login(LoginRequest request)
        //{

        //}
    }
}
