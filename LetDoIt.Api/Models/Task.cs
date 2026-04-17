using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.Models;

public class Task
{
    public int TaskId { get; set; }
    [Required]
    public int UserId { get; set; }
    public int CategoryId { get; set; } = -1;
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;
    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false; // Default to not completed
    public int Priority { get; set; } = 3; // Default to Medium
    [Required]
    public string Status { get; set; } = "Pending"; // Default to Pending
    [Required]
    public string Visibility { get; set; } = "Private"; // Default to Private

    public virtual Users? User { get; set; }
    public virtual Category? Category { get; set; }
}
