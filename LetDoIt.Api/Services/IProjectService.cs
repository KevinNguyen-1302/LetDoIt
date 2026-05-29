
using System.Security.Claims;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;

namespace LetDoIt.Api.Services
{
  public interface IProjectService
  {
    public Task<GetProjectRequest> CreateProjectAsync(CreateProjectRequest request, ClaimsPrincipal user);
    public Task<bool> UpdateProjectAsync(Guid projectId, UpdateProjectRequest request, ClaimsPrincipal user);
    public Task<bool> DeleteProjectAsync(Guid projectId, ClaimsPrincipal user);
    public Task<(List<GetProjectRequest> Data, int TotalCount)> GetProjectsByUserIdAsync(Guid userId, int pageNumber = 1, int pageSize = 10, string? searchTerm = null);
    public Task<(List<GetProjectRequest> Data, int TotalCount)> GetProjectsByUserIdAsyncWithDapper(Guid userId, int pageNumber = 1, int pageSize = 10, string? searchTerm = null);
    public Task<bool> ChangeProjectAuthorAsync(Guid projectId, Guid currentAuthorId, Guid newAuthorId, ClaimsPrincipal user);
    public Task<bool> AddMemberToProjectAsync(Guid projectId, Guid memberId, ClaimsPrincipal user);
    public Task<bool> RemoveMemberFromProjectAsync(Guid projectId, Guid memberId, ClaimsPrincipal user);
    public Task<List<UserMemberDto>> GetMembersByProjectIdAsync(Guid projectId);
  }
}