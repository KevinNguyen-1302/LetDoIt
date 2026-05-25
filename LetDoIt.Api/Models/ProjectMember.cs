using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LetsDoIt.Models;

namespace LetDoIt.Api.Models
{
    public class ProjectMember
    {
        [Key, Column(Order = 0)]
        public Guid ProjectId { get; set; }
        [Key, Column(Order = 1)]
        public Guid UserId { get; set; }
        public string Role { get; set; } = string.Empty; // Ví dụ: "Owner", "Contributor", "Viewer"
        [ForeignKey("ProjectId")]
        public virtual Project? Project { get; set; }
        [ForeignKey("UserId")]
        public virtual Users? User { get; set; }

    }
}