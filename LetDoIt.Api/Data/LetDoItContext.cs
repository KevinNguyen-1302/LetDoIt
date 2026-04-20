using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Data;

public class LetDoItContext(DbContextOptions<LetDoItContext> options) : DbContext(options)
{
    public DbSet<Models.Task> Tasks => Set<Models.Task>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Users> Users => Set<Users>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<NotificationDetail> NotificationDetails => Set<NotificationDetail>();
    public DbSet<TaskSchedule> TaskSchedules => Set<TaskSchedule>();
    public DbSet<Friend> Friends => Set<Friend>();
    public DbSet<FriendRequest> FriendRequests => Set<FriendRequest>();
    public DbSet<Session> Sessions => Set<Session>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>().HasKey(u => u.UserId);
        modelBuilder.Entity<Models.Task>().HasKey(t => t.TaskId);
        modelBuilder.Entity<Category>().HasKey(c => c.CategoryId);
        modelBuilder.Entity<Notification>().HasKey(n => n.NotiId);
        modelBuilder.Entity<TaskSchedule>().HasKey(ts => ts.ScheduleId);
        modelBuilder.Entity<Friend>().HasKey(f => f.FriendId);
        modelBuilder.Entity<FriendRequest>().HasKey(fr => fr.RequestId);
        modelBuilder.Entity<Session>().HasKey(s => s.SessionId);

        // Cấu hình composite key cho NotificationDetail
        modelBuilder.Entity<NotificationDetail>()
            .HasKey(nd => new { nd.NotiId, nd.UserId });

        // Cấu hình unique constraint cho Friend (đảm bảo không có duplicate friendships)
        modelBuilder.Entity<Friend>()
            .HasIndex(f => new { f.User1Id, f.User2Id })
            .IsUnique();

        // Cấu hình relationships
        modelBuilder.Entity<NotificationDetail>()
            .HasOne(nd => nd.Notification)
            .WithMany() // Giả sử Notification không có collection của NotificationDetail
            .HasForeignKey(nd => nd.NotiId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<NotificationDetail>()
            .HasOne(nd => nd.User)
            .WithMany() // Giả sử Users không có collection của NotificationDetail
            .HasForeignKey(nd => nd.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
