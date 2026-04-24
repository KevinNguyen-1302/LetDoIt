using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.DTOs
{
    public class RegisterRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [DataType(DataType.Password)]
        [StringLength(255, MinimumLength = 8)] // Nhớ enforce độ dài tối thiểu
        public string Password { get; set; } = null!;
        
        [Required]
        [DataType(DataType.Date)]
        public DateTime Dob { get; set; }
        [MaxLength(10)]
        public string? PhoneNumber { get; set; }

        [Required]
        [MaxLength(50)]
        public string DisplayName { get; set; } = null!;
    }
}
