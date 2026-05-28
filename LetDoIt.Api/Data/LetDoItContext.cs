using LetDoIt.Api.Models;
using LetsDoIt.Models;
using Microsoft.EntityFrameworkCore;

namespace LetDoIt.Api.Data;

public class LetDoItContext(DbContextOptions<LetDoItContext> options) : DbContext(options)
{
    public DbSet<Models.Task> Tasks => Set<Models.Task>();
    public DbSet<Users> Users => Set<Users>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<NotificationDetail> NotificationDetails => Set<NotificationDetail>();
    public DbSet<TaskSchedule> TaskSchedules => Set<TaskSchedule>();
    public DbSet<Friend> Friends => Set<Friend>();
    public DbSet<FriendRequest> FriendRequests => Set<FriendRequest>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Column> Columns => Set<Column>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>().HasKey(u => u.UserId);
        modelBuilder.Entity<Models.Task>().HasKey(t => t.TaskId);
        modelBuilder.Entity<Notification>().HasKey(n => n.NotiId);
        modelBuilder.Entity<TaskSchedule>().HasKey(ts => ts.ScheduleId);
        modelBuilder.Entity<Friend>().HasKey(f => f.FriendId);
        modelBuilder.Entity<FriendRequest>().HasKey(fr => fr.RequestId);
        modelBuilder.Entity<Session>().HasKey(s => s.SessionId);
        modelBuilder.Entity<Column>().HasKey(c => c.ColumnId);
        modelBuilder.Entity<Project>().HasKey(p => p.ProjectId);
        modelBuilder.Entity<ProjectMember>().HasKey(pm => new { pm.ProjectId, pm.UserId });

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
        
        modelBuilder.Entity<Friend>()
            .HasOne(f => f.User1)
            .WithMany() // Giả sử Users không có collection của Friend
            .HasForeignKey(f => f.User1Id)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Friend>()
            .HasOne(f => f.User2)
            .WithMany() // Giả sử Users không có collection của Friend
            .HasForeignKey(f => f.User2Id)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.Project)
            .WithMany(p => p.ProjectMembers)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectMember>()
            .HasOne(pm => pm.User)
            .WithMany()
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
