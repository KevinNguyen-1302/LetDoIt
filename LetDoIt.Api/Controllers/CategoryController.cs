using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LetDoIt.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        public CategoryController(ICategoryService service) => _service = service;

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<GetCategoryResponse>>> GetCategories()
            => Ok(await _service.GetAllCategoriesAsync(User));

        [Authorize]
        [HttpGet("task-counts")]
        public async Task<ActionResult<List<CategoryCountDto>>> GetCategoryTaskCounts()
            => Ok(await _service.GetCategoryTaskCountsAsync(User));

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
        {
            var createdCategory = await _service.CreateCategoryAsync(category, User);
            return CreatedAtAction(nameof(GetCategories), new { id = createdCategory.CategoryId }, createdCategory);
        }
    }
}
