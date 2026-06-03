using LetDoIt.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class UpdateTaskRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? IsCompleted { get; set; }
        public int? Priority { get; set; }
        public int? Visibility { get; set; } = 2; // Default to Private
        public Guid? AssigneeId { get; set; }

    }
}
