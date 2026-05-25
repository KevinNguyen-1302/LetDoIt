using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LetDoIt.Api.Models;

namespace LetsDoIt.Models
{
    [Table("Columns")]
    public class Column
    {
        [Key]
        [Column("column_id")]
        public Guid ColumnId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("title")]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Column("position")]
        public int Position { get; set; }

        // Khóa ngoại liên kết tới Project
        [Required]
        [Column("Project_Id")]
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }

        // Navigation property
        public virtual Project? Project { get; set; }

        // Quan hệ 1-N: Một cột có nhiều Task
        public virtual ICollection<LetDoIt.Api.Models.Task> Tasks { get; set; } = new List<LetDoIt.Api.Models.Task>();

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}