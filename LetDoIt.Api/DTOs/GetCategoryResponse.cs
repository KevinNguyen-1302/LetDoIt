namespace LetDoIt.Api.DTOs
{
    public class GetCategoryResponse
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string ColorCode { get; set; } = "#4169e1";
        public string IconName { get; set; } = "folder";

    }
}