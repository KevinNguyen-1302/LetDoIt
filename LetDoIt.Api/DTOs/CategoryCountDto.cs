namespace LetDoIt.Api.DTOs
{
    public class CategoryCountDto
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public int TaskCount { get; set; } = 0;
    }
}
