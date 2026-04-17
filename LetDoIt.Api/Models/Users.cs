namespace LetDoIt.Api.Models;

public class Users
{
    private int _userId;
    private string? _username;
    private string? _email;
    private string? _displayName;
    private string? _hashedPassword;
    private DateTime _createdAt;
    private DateTime _updatedAt;
    private string? _status;
    private string? _avatarUrl;
    private DateTime _lastLogin;

    public Users()
    {
    }

    public Users(int userId, string username, string email, string displayName, string hashedPassword, DateTime createdAt, DateTime updatedAt, string status, string? avatarUrl, DateTime lastLogin)
    {
        _userId = userId;
        _username = username;
        _email = email;
        _displayName = displayName;
        _hashedPassword = hashedPassword;
        _createdAt = createdAt;
        _updatedAt = updatedAt;
        _status = status;
        _avatarUrl = avatarUrl;
        _lastLogin = lastLogin;
    }

    public int UserId { get => _userId; set => _userId = value; }
    public required string Username { get => _username!; set => _username = value; }
    public required string Email { get => _email!; set => _email = value; }
    public required string DisplayName { get => _displayName!; set => _displayName = value; }
    public required string HashedPassword { get => _hashedPassword!; set => _hashedPassword = value; }
    public required DateTime CreatedAt { get => _createdAt; set => _createdAt = value; }
    public required DateTime UpdatedAt { get => _updatedAt; set => _updatedAt = value; }
    public required string Status { get => _status!; set => _status = value; }
    public string? AvatarUrl { get => _avatarUrl; set => _avatarUrl = value; }
    public required DateTime LastLogin { get => _lastLogin; set => _lastLogin = value; }
    public virtual ICollection<Task>? Tasks { get; set; }

}
