using LetDoIt.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class GetTaskResponse
    {
        public Guid TaskId { get; set; }
        public Guid? CategoryId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; } = false; // Default to not completed
        public int Priority { get; set; } = 3; // Default to Medium
        public Guid? ColumnId { get; set; }
        public TaskVisibility Visibility { get; set; } = TaskVisibility.Private; // Default to Private
    }
}
