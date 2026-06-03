namespace LetDoIt.Api.DTOs
{
    public class UserMemberDto
    {
        public Guid UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = null!;
    }
}
