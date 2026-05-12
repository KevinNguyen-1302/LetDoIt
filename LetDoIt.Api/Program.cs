using LetDoIt.Api.Data;
using LetDoIt.Api.Services;
using LetDoIt.Api.Workers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<LetDoItContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<ISessionService, SessionService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Tự động convert Enum từ số sang chuỗi chữ cho dễ đọc
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddHostedService<PriorityWorker>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowReactApp");

app.MapGet("/health/db", async (LetDoItContext db) =>
{
    bool canConnect = await db.Database.CanConnectAsync();
    return canConnect ? Results.Ok("DB connected") : Results.Problem("DB connection failed");
});

app.MapGet("/", () => "LetDoIt API is running");

app.UseAuthorization();

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

app.Run();

