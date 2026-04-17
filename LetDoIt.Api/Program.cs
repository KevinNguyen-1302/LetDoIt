using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();

// Get connection string from appsettings
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add DbContext with PostgreSQL
builder.Services.AddDbContext<LetDoItContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

app.MapGet("/health/db", async (LetDoItContext db) =>
{
    bool canConnect = await db.Database.CanConnectAsync();
    return canConnect ? Results.Ok("DB connected") : Results.Problem("DB connection failed");
});

app.MapGet("/", () => "LetDoIt API is running");

// POST endpoint for creating a new User
app.MapPost("/users", async (LetDoItContext db, Users user) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/users/{user.UserId}", user);
});

app.MapGet("/users/{id}", async (LetDoItContext db, int id) =>
{
    var user = await db.Users.FindAsync(id);
    return user != null ? Results.Ok(user) : Results.NotFound();
});

// POST endpoint for creating a new Task
app.MapPost("/tasks", async (LetDoItContext db, LetDoIt.Api.Models.Task task) =>
{
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/tasks/{task.TaskId}", task);
});
// GET endpoint to retrieve tasks for user with id=1
app.MapGet("/tasks/user/1", async (LetDoItContext db) =>
{
    var tasks = await db.Tasks.Where(t => t.UserId == 1).ToListAsync();
    return Results.Ok(tasks);
});

app.MigrateDb();

app.Run();
