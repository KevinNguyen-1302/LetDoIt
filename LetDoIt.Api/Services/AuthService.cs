using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using Microsoft.AspNetCore.Identity;
using LetDoIt.Api.DTOs;
using System;

namespace LetDoIt.Api.Services;

public class AuthService : IAuthService
{
    public async Task<string?> LoginAsync(string username, string password)
    {
        throw new NotImplementedException();
    }

    public Task<bool> RegisterAsync()
    {
        throw new NotImplementedException();
    }
}
