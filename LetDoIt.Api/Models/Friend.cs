using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class Friend
{
    [Key]
    public int FriendId { get; set; }

    [Required]
    public int User1Id { get; set; }

    [Required]
    public int User2Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [ForeignKey("User1Id")]
    public virtual Users? User1 { get; set; }

    [ForeignKey("User2Id")]
    public virtual Users? User2 { get; set; }
}