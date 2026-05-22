using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        public CategoryController(ICategoryService service) => _service = service;

        [Authorize ]
        [HttpGet]
        public async Task<ActionResult<List<GetCategoryResponse>>> GetCategories()
            => Ok(await _service.GetAllCategoriesAsync(User));

        [Authorize ]
        [HttpGet]
        public async Task<ActionResult<List<CategoryCountDto>>> GetCategoryTaskCounts()
            => Ok(await _service.GetCategoryTaskCountsAsync(User));

        [Authorize ]
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(GetCategoryResponse category)
        {
            var createdCategory = await _service.CreateCategoryAsync(category, User);
            return CreatedAtAction(nameof(GetCategories), new { id = createdCategory.CategoryId }, createdCategory);
        }

        [Authorize ]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryCountDto>>> GetStatsWithDapper()
        {
            var userId = Guid.Parse(User.FindFirst(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?
                                                                                 .Value ?? throw new UnauthorizedAccessException("UserId not found"));
            var stats = await _service.GetStatsWithDapperAsync(userId);
            return Ok(stats);
        }

        [Authorize ]
        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteCategory(Guid categoryId)
            => Ok(await _service.DeleteCategoryAsync(categoryId, User));

        [Authorize ]
        [HttpPut]
        public async Task<ActionResult<Category>> UpdateCategory(Guid categoryId, GetCategoryResponse category)
            => Ok(await _service.UpdateCategoryAsync(categoryId, category, User));
    }
}
