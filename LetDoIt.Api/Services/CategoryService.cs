using Dapper;
using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Security.Claims;

namespace LetDoIt.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly LetDoItContext _context;
        private readonly string _connectionString;
        public CategoryService(LetDoItContext context, IConfiguration configuration)
        {
            _context = context;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        public async Task<Category> CreateCategoryAsync(GetCategoryResponse category, ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var newCategory = new Category
            {
                Name = category.Name,
                ColorCode = category.ColorCode,
                IconName = category.IconName,
                UserId = userId
            };
            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();
            return newCategory;
        }

        public async Task<List<GetCategoryResponse>> GetAllCategoriesAsync(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            var connection = _context.Database.GetDbConnection();
            string sql = @"SELECT ""CategoryId"", ""Name"", ""ColorCode"", ""IconName"" 
                        FROM ""Categories"" 
                        WHERE ""UserId"" = @UserId";

            var categories = await connection.QueryAsync<GetCategoryResponse>(sql, new { UserId = userId });

            return categories.ToList();
        }
        public async Task<IEnumerable<CategoryCountDto>> GetStatsWithDapperAsync(Guid userId)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            var sql = @"SELECT c.""Name"" as CategoryName, COUNT(t.""TaskId"") as TaskCount 
                    FROM ""Categories"" c 
                    LEFT JOIN ""Tasks"" t ON c.""CategoryId"" = t.""CategoryId""
                    WHERE c.""UserId"" = @UserId
                    GROUP BY c.""Name""";

            return await connection.QueryAsync<CategoryCountDto>(sql, new { UserId = userId });
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
            existingCategory.IconName = category.IconName;
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
