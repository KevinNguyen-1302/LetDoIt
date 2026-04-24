using LetDoIt.Api.Models;

namespace LetDoIt.Api.DTOs
{
    public class ChangePriorityRequest
    {
        // Nullable so client can omit it to let the server calculate priority automatically
        public Priority? Priority { get; set; }
    }
}