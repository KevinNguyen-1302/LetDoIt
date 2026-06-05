using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using LetDoIt.Api.Workers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// builder.Services.AddIdentity<Users, IdentityRole>(options =>
// {
//     options.Password.RequireDigit = true;
//     options.Password.RequireLowercase = true;
//     options.Password.RequireNonAlphanumeric = true;
//     options.Password.RequireUppercase = true;
//     options.Password.RequiredLength = 8;
// }).AddEntityFrameworkStores<LetDoItContext>();


builder.Services.AddDbContext<LetDoItContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddCookie()
    .AddGoogle(options =>
    {
        var clientId = builder.Configuration["Authentication:Google:ClientId"];

        if (clientId == null)
        {
            throw new ArgumentException(nameof(clientId));
        }

        var clientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

        if (clientSecret == null)
        {
            throw new ArgumentException(nameof(clientSecret));
        }

        options.ClientId = clientId;
        options.ClientSecret = clientSecret;
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AppSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AppSettings:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Token"]!))
        };
    });

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IProjectService, ProjectService>();

builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddScoped<ISessionService, SessionService>();

builder.Services.AddScoped<IColumnService, ColumnService>();


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Tự động convert Enum từ số sang chuỗi chữ cho dễ đọc
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddHostedService<PriorityWorker>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<ResponseWrapperMiddleware>();

app.MapControllers();

app.MigrateDb();

Console.Write("\u001b[38;5;172m");

Console.WriteLine(@"
                +------+
                |      |
                |      |
                |      |
                |      |
   +------------+      +-----------+
   |         JESUS IS KING         |
   |                               |
   +------------+      +-----------+
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                |      |
                +------+
          LetDoIt API Running...
");

Console.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

app.MapGet("/api/account/login/google", ([FromQuery] string returnUrl,
                                        LinkGenerator linkGenerator,
                                        HttpContext context) =>
{
    var redirectUrl = linkGenerator.GetPathByName(context, "GoogleLoginCallback") + $"?returnUrl={Uri.EscapeDataString(returnUrl)}";
    var properties = new AuthenticationProperties { RedirectUri = redirectUrl };

    return Results.Challenge(properties, ["Google"]);
});


app.MapGet("/api/account/login/google/callback", async ([FromQuery] string returnUrl,
    HttpContext context, IAuthService authService) =>
{
    var result = await context.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    if (!result.Succeeded)
    {
        return Results.Unauthorized();
    }

    var token = await authService.LoginWithGoogleAsync(result.Principal);

    // Xoá cookie đăng nhập Google tạm thời
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    return Results.Redirect($"{returnUrl}?accessToken={token.AccessToken}&refreshToken={token.RefreshToken}");

}).WithName("GoogleLoginCallback");

app.Run();

