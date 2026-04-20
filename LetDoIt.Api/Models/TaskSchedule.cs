using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LetDoIt.Api.Models;

public class TaskSchedule
{
    [Key]
    public int ScheduleId { get; set; }

    [Required]
    [ForeignKey(nameof(Task))]
    public int TaskId { get; set; }

    [Required]
    public DateTime TargetDate { get; set; }

    [Required]
    public TimeSpan StartTime { get; set; }

    [Required]
    public TimeSpan EndTime { get; set; }

    [Required]
    public bool IsDone { get; set; } = false;

    public virtual Task? Task { get; set; }
}
