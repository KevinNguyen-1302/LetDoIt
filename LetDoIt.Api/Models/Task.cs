using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LetsDoIt.Models;

namespace LetDoIt.Api.Models;

public class Task
{
    [Key]
    public Guid TaskId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;
    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false; // Default to not completed
    public Priority Priority { get; set; } = Priority.Medium; // Default to Medium
    
    public Guid? ColumnId { get; set; } // Foreign Key to Column.Id (nullable for now)

    [ForeignKey("ColumnId")]
    public virtual Column? Column { get; set; }
    [Required]
    public TaskVisibility Visibility { get; set; } = TaskVisibility.Private; // Default to Private

    public virtual Users? User { get; set; }
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