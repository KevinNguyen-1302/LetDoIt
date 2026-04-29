using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.Models;

public class Users
{
    [Key]
    public Guid UserId { get; set; }
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
    [Phone]
    public string? PhoneNumber { get; set; }
    public DateOnly Dob { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? Status { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public DateTime LastLogin { get; set; } = DateTime.UtcNow;
    public virtual ICollection<Task> Tasks { get; set; } = new HashSet<Task>();
    public string Role { get; set; } = "User"; // Default role is "User"
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
}

