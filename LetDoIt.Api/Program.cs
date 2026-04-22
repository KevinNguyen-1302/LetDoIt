using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using LetDoIt.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<LetDoItContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Tự động convert Enum từ số sang chuỗi chữ cho dễ đọc
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });



var app = builder.Build();

app.MapGet("/health/db", async (LetDoItContext db) =>
{
    bool canConnect = await db.Database.CanConnectAsync();
    return canConnect ? Results.Ok("DB connected") : Results.Problem("DB connection failed");
});

app.MapGet("/", () => "LetDoIt API is running");

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

app.Run();

