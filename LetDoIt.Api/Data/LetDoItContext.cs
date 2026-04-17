using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Data;

public class LetDoItContext(DbContextOptions<LetDoItContext> options) : DbContext(options)
{
    public DbSet<Models.Task> Tasks => Set<Models.Task>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Users> Users => Set<Users>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>().HasKey(u => u.UserId);
        modelBuilder.Entity<Models.Task>().HasKey(t => t.TaskId);
        modelBuilder.Entity<Category>().HasKey(c => c.CategoryId);
    }
}
