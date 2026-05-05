using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Security.Claims;

namespace LetDoIt.Api.Services
{
    public interface ISessionService
    {
        Task<Session> SaveCompletedSessionAsync(CreateSessionRequestDto request, ClaimsPrincipal user);

    }
}
