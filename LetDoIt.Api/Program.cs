using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;
using LetDoIt.Api.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<LetDoItContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

app.MapGet("/health/db", async (LetDoItContext db) =>
{
    bool canConnect = await db.Database.CanConnectAsync();
    return canConnect ? Results.Ok("DB connected") : Results.Problem("DB connection failed");
});

app.MapGet("/", () => "LetDoIt API is running");


app.MigrateDb();

app.Run();
