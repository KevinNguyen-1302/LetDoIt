namespace LetDoIt.Api.DTOs;
public class GetProjectRequest
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = string.Empty;
    public int NumberOfMembers { get; set; }
}