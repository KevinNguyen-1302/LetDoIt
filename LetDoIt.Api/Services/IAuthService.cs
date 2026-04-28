using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;

namespace LetDoIt.Api.Services
{
    public interface IAuthService
    {
        Task<Users?> RegisterAsync(RegisterRequest request);
        Task<string?> LoginAsync(LoginRequest request);
        Task<Users?> GetUserByIdAsync(Guid userId);

    }
}
