using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class Notification
{
    [Key]
    public int NotiId { get; set; }

    [Required]
    public int SenderId { get; set; }

    [Required]
    public int ReferenceId { get; set; }

    [Required]
    [StringLength(20)]
    public string ReferenceType { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Content { get; set; } = "Test";

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [ForeignKey("SenderId")]
    public virtual Users? Sender { get; set; }
}