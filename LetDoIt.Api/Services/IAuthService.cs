using System.Security.Claims;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;

namespace LetDoIt.Api.Services
{
    public interface IAuthService
    {
        Task<Users?> RegisterAsync(RegisterRequest request);
        Task<TokenResponseDto?> LoginAsync(LoginRequest request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
        Task<Users?> GetUserByIdAsync(Guid userId);
        Task<List<UserDto>> GetUserByUsernameAsync(string username);
        Task<TokenResponseDto> LoginWithGoogleAsync(ClaimsPrincipal? principal);
    }
}
