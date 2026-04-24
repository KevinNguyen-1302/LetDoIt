using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class LoginRequest
    {
        [Required]
        public string UsernameOrEmail { get; set; } = null!;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;
    }
}
