namespace LetDoIt.Api.Models;

public class Task
{
    private int _taskId;
    private int _userId; 
    private int? _categoryId;
    private string _title;
    private string _description;
    private DateTime _dueDate;
    private bool _isCompleted;
    private int _priority;
    private string _status;
    private string _visibility;

    public Task()
    {
        _description = string.Empty;
        _status = string.Empty;
    }

    public Task(int taskId, int userId, int? categoryId, string title, string description, DateTime dueDate, bool isCompleted, int priority, string status, string visibility)
    {
        _taskId = taskId;
        _userId = userId;
        _categoryId = categoryId;
        _title = title;
        _description = description;
        _dueDate = dueDate;
        _isCompleted = isCompleted;
        _priority = priority;
        _status = status;
        _visibility = visibility;
    }

    public int TaskId { get => _taskId; set => _taskId = value; }
    public required int UserId { get => _userId; set => _userId = value; }
    public int? CategoryId { get => _categoryId; set => _categoryId = value; }
    public required string Title { get => _title; set => _title = value; }
    public string Description { get => _description; set => _description = value; }
    public required DateTime DueDate { get => _dueDate; set => _dueDate = value; }
    public required bool IsCompleted { get => _isCompleted; set => _isCompleted = value; }
    public  int Priority { get => _priority; set => _priority = value; }
    public required string Status { get => _status; set => _status = value; }
    public required string Visibility { get => _visibility; set => _visibility = value; }
    public virtual Users? User { get; set; }
    public virtual Category? Category { get; set; }

}
