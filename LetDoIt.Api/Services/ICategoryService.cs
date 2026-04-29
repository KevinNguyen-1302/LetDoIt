using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Security.Claims;
namespace LetDoIt.Api.Services
{
    public interface ICategoryService
    {
        Task<List<GetCategoryResponse>> GetAllCategoriesAsync(ClaimsPrincipal user);
        Task<Category> CreateCategoryAsync(Category category, ClaimsPrincipal user);
        Task<Category> UpdateCategoryAsync(Guid categoryId, GetCategoryResponse category, ClaimsPrincipal user);
        Task<List<CategoryCountDto>> GetCategoryTaskCountsAsync(ClaimsPrincipal user);
    }
}
