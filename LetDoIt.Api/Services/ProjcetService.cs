using System.Security.Claims;
using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetsDoIt.Models;

namespace LetDoIt.Api.Services;

public class ProjectService(LetDoItContext context) : IProjectService
{
    private readonly LetDoItContext _context = context;

    public Task<bool> ChangeProjectAuthorAsync(Guid projectId, Guid newAuthorId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        throw new NotImplementedException();
    }

    public Task<Project?> CreateProjectAsync(CreateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var newProject = new Project
        {
            Title = request.Title,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };
        if (_context.Projects.Any(p => p.Title.Equals(request.Title) && p.UserId == userId))
        {
            throw new ArgumentException("Bạn đã có một project với tên này rồi!");
        }
        
        _context.Projects.Add(newProject);
        _context.SaveChanges();
        return Task.FromResult<Project?>(newProject);
    }

    public Task<bool> DeleteProjectAsync(Guid projectId, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        throw new NotImplementedException();
    }

    public Task<List<Project>> GetProjectsByUserIdAsync(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UpdateProjectAsync(Guid projectId, UpdateProjectRequest request, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        throw new NotImplementedException();
    }

    private Guid GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
        }
        return userId;
    }
}
