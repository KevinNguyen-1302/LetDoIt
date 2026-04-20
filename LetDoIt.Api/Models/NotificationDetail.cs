using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class NotificationDetail
{
    [Key, Column(Order = 0)]
    public int NotiId { get; set; }

    [Key, Column(Order = 1)]
    public int UserId { get; set; }

    [Required]
    public bool IsRead { get; set; } = false; // Mặc định là chưa đọc (Bit trong DB)

    // ReadAt nên để Nullable vì chỉ có giá trị sau khi người dùng nhấn xem thông báo
    public DateTime? ReadAt { get; set; }

    [ForeignKey("NotiId")]
    public virtual Notification? Notification { get; set; }

    [ForeignKey("UserId")]
    public virtual Users? User { get; set; }
}