using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LetDoIt.Api.Services;

public class AuthService(LetDoItContext context, IConfiguration configuration) : IAuthService
{
    public Task<Users?> GetUserByIdAsync(Guid userId)
    {
        throw new NotImplementedException();
    }

    public async Task<string?> LoginAsync(LoginRequest request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.Email == request.Email);
        if (user is null)
        {
            return null;
        }
        if (new PasswordHasher<Users>().VerifyHashedPassword(user, user.HashedPassword, request.Password) == PasswordVerificationResult.Failed)
        {
            return null;
        }
        user.LastLogin = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return CreateToken(user);
    }

    public async Task<Users?> RegisterAsync(RegisterRequest request)
    {
        if (await context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return null; // Username already exists
        }
        var user = new Users
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            DisplayName = request.DisplayName,
            Dob = DateOnly.FromDateTime(request.Dob),
            PhoneNumber = request.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow,
        };

        context.Users.Add(user);
        user.HashedPassword = new PasswordHasher<Users>().HashPassword(user, request.Password);

        await context.SaveChangesAsync();

        return user;
    }
    private string CreateToken(Users user)
    {
        var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            };

        // Use correct key names and validate presence
        var tokenKey = configuration.GetValue<string>("AppSettings:Token")
                       ?? throw new InvalidOperationException("JWT signing key not configured (AppSettings:Token).");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetValue<string>("AppSettings:Issuer"),
            audience: configuration.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    
}
