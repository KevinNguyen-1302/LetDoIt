using LetDoIt.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class UpdateTaskRequest
    {
        public Guid? CategoryId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? IsCompleted { get; set; }
        public int? Priority { get; set; }
        public TaskVisibility? Visibility { get; set; } = TaskVisibility.Private; // Default to Private
    }
}
