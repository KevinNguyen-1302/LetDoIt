using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class CreateSessionRequestDto
    {
        public Guid? TaskId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }
    }
}
