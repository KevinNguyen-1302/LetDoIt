
using System.Security.Claims;
using LetsDoIt.Models;
using LetDoIt.Api.DTOs;

namespace LetDoIt.Api.Services
{
  public interface IProjectService
    {
        public Task<Project?> CreateProjectAsync(CreateProjectRequest request, ClaimsPrincipal user);
        public Task<bool> UpdateProjectAsync(Guid projectId, UpdateProjectRequest request, ClaimsPrincipal user);
        public Task<bool> DeleteProjectAsync(Guid projectId, ClaimsPrincipal user);
        public Task<List<Project>> GetProjectsByUserIdAsync(Guid userId);
        public Task<bool> ChangeProjectAuthorAsync(Guid projectId, Guid newAuthorId, ClaimsPrincipal user);
    }
}