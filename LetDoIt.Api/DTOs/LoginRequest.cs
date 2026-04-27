using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class LoginRequest
    {
        public required string Username { get; set; }        
        public required string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }
}
