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
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", 
        ErrorMessage = "Mật khẩu quá yếu! Cần ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.")]
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
