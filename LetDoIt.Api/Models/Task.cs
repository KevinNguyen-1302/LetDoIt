using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.Models;

public class Task
{
    [Key]
    public int TaskId { get; set; }
    [Required]
    public int UserId { get; set; }
    public int? CategoryId { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;
    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false; // Default to not completed
    public Priority Priority { get; set; } = Priority.Medium; // Default to Medium
    [Required]
    public Status Status { get; set; } = Status.Pending; // Default to Pending
    [Required]
    public TaskVisibility Visibility { get; set; } = TaskVisibility.Private; // Default to Private

    public virtual Users? User { get; set; }
    public virtual Category? Category { get; set; }
}

public enum Status
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Late = 4,
    Canceled = 5
}

public enum TaskVisibility
{
    Private = 1,
    Public = 2
}

public enum Priority
{
    Low = 1, Medium = 2, High = 3, Urgent = 4
}