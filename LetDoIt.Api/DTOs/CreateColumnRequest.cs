using System;

namespace LetDoIt.Api.DTOs;

public class CreateColumnRequest
{
    public string Title { get; set; } = string.Empty;
    public int Position { get; set; }
    public Guid ProjectId { get; set; }
}

