using LetDoIt.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class UpdateTaskRequest
    {
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public int? CategoryId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; } = false; // Default to not completed
        public int Priority { get; set; } = 3; // Default to Medium
        public Status Status { get; set; } = Status.Pending; // Default to Pending
        public TaskVisibility Visibility { get; set; } = TaskVisibility.Private; // Default to Private
    }
}
