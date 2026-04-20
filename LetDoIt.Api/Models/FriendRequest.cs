using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class FriendRequest
{
    [Key]
    public int RequestId { get; set; }

    [Required]
    public int SenderId { get; set; }

    [Required]
    public int RecieverId { get; set; } // Giữ nguyên tên 'Reciever' theo bản thiết kế của bạn

    [StringLength(200)]
    public string? Message { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [Required]
    [StringLength(20)]
    public RequestStatus Status { get; set; } = RequestStatus.Pending; // Các trạng thái: Pending, Accepted, Rejected

    [ForeignKey("SenderId")]
    public virtual Users? Sender { get; set; }

    [ForeignKey("RecieverId")]
    public virtual Users? Receiver { get; set; }
}

public enum RequestStatus
{
    Pending = 1,
    Accepted = 2,
    Rejected = 3
}