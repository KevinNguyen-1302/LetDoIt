using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
// Đã xóa using Microsoft.VisualBasic;

namespace LetDoIt.Api.Workers
{
    public class PriorityWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public PriorityWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async System.Threading.Tasks.Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<LetDoItContext>();

                    var tasks = db.Tasks
                        .Where(t => !t.IsCompleted)
                        .ToList();
                    var now = DateTime.UtcNow;

                    foreach (var task in tasks)
                    {
                        var daysRemaining = (task.DueDate - now).TotalDays;
                        if (daysRemaining <= 1) task.Priority = Priority.Urgent;
                        else if (daysRemaining <= 3) task.Priority = Priority.High;
                        else if (daysRemaining <= 7) task.Priority = Priority.Medium;
                        else task.Priority = Priority.Low;
                    }

                    await db.SaveChangesAsync(stoppingToken);
                }

                await System.Threading.Tasks.Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}