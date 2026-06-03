using System;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using System.Security.Claims;
using LetsDoIt.Models;

namespace LetDoIt.Api.Services;

public interface IColumnService
{
    public Task<Column?> CreateColumnAsync(CreateColumnRequest request, ClaimsPrincipal user);
    public Task<bool> UpdateColumnAsync(Guid columnId, UpdateColumnRequest request, ClaimsPrincipal user);
    public Task<bool> DeleteColumnAsync(Guid columnId, ClaimsPrincipal user);
    public Task<bool> ChangeColumnPositionAsync(Guid columnId, int newPosition, ClaimsPrincipal user);
    public Task<List<Column>> GetColumnsByUserIdAsync(Guid userId);
    public Task<List<Column>> GetColumnsByProjectIdAsync(Guid projectId, ClaimsPrincipal user);
}
