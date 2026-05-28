using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LetsDoIt.Models;

namespace LetDoIt.Api.Models
{
    [Table("Projects")]
    public class Project
    {
        [Key]
        [Column("project_id")]
        public Guid ProjectId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("ProjectName")]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        // Khóa ngoại liên kết tới User
        [Required]
        [Column("CreatedBy")]
        public Guid UserId { get; set; }
        public bool IsDeleted { get; set; } = false;

        // Navigation property (Nếu bro có class User)
        [ForeignKey("UserId")]
        public virtual Users? User { get; set; }

        // Quan hệ 1-N: Một project có nhiều Task
        public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<ProjectMember> ProjectMembers { get; set; } = [];
    }
}