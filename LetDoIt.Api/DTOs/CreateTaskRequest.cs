namespace LetDoIt.Api.DTOs;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public int Priority { get; set; } = 2;
    public int Visibility { get; set; } = 2;
    public Guid CreatedBy { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid ColumnId { get; set; }
}

