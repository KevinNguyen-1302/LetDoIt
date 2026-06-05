using Dapper;
using LetDoIt.Api.Data;
using LetDoIt.Api.DTOs;
using LetDoIt.Api.Models;
using LetDoIt.Api.Response;
using LetsDoIt.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LetDoIt.Api.Services;

public class AuthService(LetDoItContext context, IConfiguration configuration) : IAuthService
{
    public async Task<Users?> GetUserByIdAsync(Guid userId)
    {
        var connection = context.Database.GetDbConnection();
        string sql = @"SELECT ""UserId"", ""Username"", ""DisplayName"", ""Email"", ""PhoneNumber"", ""Dob"" 
                    FROM ""Users"" 
                    WHERE ""UserId"" = @Id";
        var user = await connection.QuerySingleOrDefaultAsync<Users>(sql, new { Id = userId });

        return user;
    }

    public async Task<List<UserDto>> GetUserByUsernameAsync(string username)
    {
        var users = await context.Users
        .Where(u => EF.Functions.ILike(u.Username, $"%{username}%"))
        .Select(u => new UserDto
        {
            UserId = u.UserId,
            Username = u.Username,
            Email = u.Email,
            DisplayName = u.DisplayName,
            AvatarUrl = u.AvatarUrl
        })
        .Take(10)
        .ToListAsync();

        return users;
    }

    public async Task<TokenResponseDto?> LoginAsync(LoginRequest request)
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
        return await CreateTokenResponse(user);
    }

    private async Task<TokenResponseDto> CreateTokenResponse(Users user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
        };
    }

    public async Task<Users?> RegisterAsync(RegisterRequest request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return null; // Email already exists
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
        await context.SaveChangesAsync();

        return user;
    }

    public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
    {
        var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
        if (user == null)
        {
            return null;
        }
        return await CreateTokenResponse(user);
    }

    private async Task<Users?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null; // Invalid refresh token
        }
        return user;
    }

    private string GenerateRefreshToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private async Task<String> GenerateAndSaveRefreshTokenAsync(Users user)
    {
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Refresh token valid for 7 days
        await context.SaveChangesAsync();
        return refreshToken;
    }
    private string CreateToken(Users user)
    {
        var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("sub", user.UserId.ToString()) // Add short claim for frontend
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

    public async Task<TokenResponseDto> LoginWithGoogleAsync(ClaimsPrincipal? principal)
    {
        if (principal == null)
        {
            throw new BusinessException(1008, "Cannot login with Google", 400);
        }

        var email = principal.FindFirstValue(ClaimTypes.Email);

        if (email == null)
        {
            throw new BusinessException(1009, "Cannot login with Google: Email is null", 400);
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            var newUser = new Users
            {
                UserId = Guid.NewGuid(),
                Username = email,
                Email = email,
                DisplayName = principal.FindFirstValue(ClaimTypes.Name) 
                              ?? principal.FindFirstValue(ClaimTypes.GivenName) 
                              ?? email,
                HashedPassword = new PasswordHasher<Users>().HashPassword(null!, Guid.NewGuid().ToString("N")),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow,
                Role = "User"
            };

            context.Users.Add(newUser);
            await context.SaveChangesAsync();

            user = newUser;
        }
        else
        {
            user.LastLogin = DateTime.UtcNow;
            await context.SaveChangesAsync();
        }

        return await CreateTokenResponse(user);
    }
}

