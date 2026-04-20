using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.Models;

public class Users
{
    [Key]
    public int UserId { get; set; }
    [Required]
    [MaxLength(200)]
    public string Username { get; set; } = null!;
    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = null!;
    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = null!;
    [Required]
    [MaxLength(255)]
    public string HashedPassword { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    [MaxLength(20)]
    public string? Status { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public DateTime LastLogin { get; set; } = DateTime.UtcNow;
    public virtual ICollection<Task> Tasks { get; set; } = new HashSet<Task>();
}

