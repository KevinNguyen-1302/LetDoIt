using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly LetDoItContext _context;
        public CategoryService(LetDoItContext context)
        {
            _context = context;
        }

        public async Task<Category> CreateCategoryAsync(Category category, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);

            category.UserId = userId;
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<List<GetCategoryResponse>> GetAllCategoriesAsync(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var tasks = await _context.Categories
                .Where(c => c.UserId == userId)
                .Select(c => new GetCategoryResponse
                {
                    Name = c.Name,
                    ColorCode = c.ColorCode
                })
                .ToListAsync();
            return tasks;
        }

        public async Task<Category> UpdateCategoryAsync(Guid CategoryId, GetCategoryResponse category, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            
            var existingCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.CategoryId == CategoryId && c.UserId == userId);

            if (existingCategory == null)
            {
                return null!;
            }

            existingCategory.Name = category.Name;
            existingCategory.ColorCode = category.ColorCode;

            await _context.SaveChangesAsync();
            return existingCategory;
        }

        public async Task<List<CategoryCountDto>> GetCategoryTaskCountsAsync(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);

            // Truy vấn lấy danh sách category của user cùng với số lượng task trong mỗi category
            return await _context.Categories
                .Where(c => c.UserId == userId)
                .Select(c => new CategoryCountDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.Name,
                    // Đếm số task của category này
                    TaskCount = c.Tasks.Count()
                })
                .ToListAsync();
        }

        private static Guid GetUserId (ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
            }
            return userId;
        }

        
    }
}
