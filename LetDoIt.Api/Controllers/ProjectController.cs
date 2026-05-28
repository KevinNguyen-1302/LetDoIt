using LetDoIt.Api.DTOs;
using LetDoIt.Api.Response;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProjectController(IProjectService service) : ControllerBase
    {
        private readonly IProjectService _service = service;
        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> CreateProject(CreateProjectRequest request)
        {
            var project = await _service.CreateProjectAsync(request, User);
            return Ok(new { Data = project });
        }

        [Authorize(Roles = "Manager")]
        [HttpPut("{projectId}")]
        public async Task<ActionResult<ApiResponse<object>>> UpdateProject(Guid projectId, UpdateProjectRequest request)
        {
            await _service.UpdateProjectAsync(projectId, request, User);
            if (projectId == Guid.Empty)
                throw new BusinessException(1002, "Cannot update project", 400);
            return Ok();
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("{projectId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteProject(Guid projectId)
        {
            await _service.DeleteProjectAsync(projectId, User);
            if (projectId == Guid.Empty)
                throw new BusinessException(1003, "Cannot delete project", 400);
            return Ok();
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<ActionResult<ApiResponse<object>>> GetProjectsByUserId(Guid userId, int pageNumber = 1, int pageSize = 10, string? searchTerm = null)
        {
            var (projects, totalCount) = await _service.GetProjectsByUserIdAsync(userId, pageNumber, pageSize, searchTerm);
            if (projects == null)
                throw new BusinessException(1004, "Cannot get projects", 404);
            return Ok(new { Data = projects, TotalCount = totalCount });
        }

        [Authorize]
        [HttpGet("WithDapper/{userId}")]
        public async Task<ActionResult<ApiResponse<object>>> GetProjectsByUserIdWithDapper(Guid userId, int pageNumber = 1, int pageSize = 10, string? searchTerm = null)
        {
            var (projects, totalCount) = await _service.GetProjectsByUserIdAsyncWithDapper(userId, pageNumber, pageSize, searchTerm);
            if (projects == null)
                throw new BusinessException(1005, "Cannot get projects with Dapper", 404);
            return Ok(new { Data = projects, TotalCount = totalCount });
        }
    }
}