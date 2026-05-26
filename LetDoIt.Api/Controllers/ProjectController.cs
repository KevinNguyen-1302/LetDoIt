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
            if (project is null) 
                throw new BusinessException(1001, "Không thể tạo project", 400);
            
            return Ok(project);
        }
    }
}