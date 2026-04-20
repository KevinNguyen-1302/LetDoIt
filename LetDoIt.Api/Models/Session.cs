using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class Session
{
    [Key]
    public int SessionId { get; set; }

    [Required]
    [ForeignKey("Task")]
    public int TaskId { get; set; }

    [Required]
    public DateTime StartTime { get; set; } = DateTime.UtcNow; // Mặc định là thời điểm tạo Session

    // EndTime có thể cho phép Null (?) vì khi một phiên Pomodoro vừa bắt đầu, 
    // nó chưa có thời gian kết thúc.
    public DateTime? EndTime { get; set; } 

    // Tính bằng phút (Int). Sẽ được cập nhật khi Session kết thúc.
    public int Duration { get; set; } 

    [Required]
    [StringLength(20)] // Tương ứng với Nvarchar(20) trong database
    public SessionStatus Status { get; set; } = SessionStatus.Running; // Gán giá trị mặc định khi khởi tạo
    
    public virtual Task? Task { get; set; }
}

public enum SessionStatus
{
    Running = 1,
    Completed = 2,
    Pause = 3,
    Canceled = 4
}