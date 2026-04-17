using System.ComponentModel.DataAnnotations;

namespace LetDoIt.Api.Models;

public class Category
{
    public int CategoryId { get; set; }
    public required int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(20)]
    public string ColorCode { get; set; } = "#4169e1"; // Default to Royal Blue

    public virtual Users? User { get; set; }
    public virtual ICollection<Task> Tasks { get; set; } = new HashSet<Task>();
}

       
   