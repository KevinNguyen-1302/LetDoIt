namespace LetDoIt.Api.Models;

public class Category
{
    private int _categoryId;
    private int _userId;
    private string _categoryName;
    private string _colorCode;

    public Category()
    {
    }

    public Category(int categoryId, int userId, string categoryName, string colorCode)
    {
        _categoryId = categoryId;
        _userId = userId;
        _categoryName = categoryName;
        _colorCode = colorCode;
    }

    public int CategoryId { get => _categoryId; set => _categoryId = value; }
    public required int UserId { get => _userId; set => _userId = value; }
    public required string Name { get => _categoryName; set => _categoryName = value; }
    public string ColorCode { get => _colorCode; set => _colorCode = value; }
    public virtual Users? User { get; set; }
    public virtual ICollection<Task>? Tasks { get; set; }
}

       
   