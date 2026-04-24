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

                    // 1. TỐI ƯU DB: Chỉ lấy Task chưa xong VÀ bắt buộc có DueDate
                    var tasks = db.Tasks
                        .Where(t => !t.IsCompleted && t.DueDate != null)
                        .ToList();

                    // 2. Lấy giờ 1 lần duy nhất ở ngoài vòng lặp
                    var now = DateTime.UtcNow;

                    foreach (var task in tasks)
                    {
                        // Gọi .Value vì đã check != null ở trên.
                        // Khuyên dùng .Date để tính chênh lệch ngày cho chuẩn xác
                        var daysRemaining = (task.DueDate - now).TotalDays;

                        // 3. Ép kiểu bằng (int) nhìn gọn và chuẩn C# hơn
                        if (daysRemaining <= 1) task.Priority = Priority.Urgent;
                        else if (daysRemaining <= 3) task.Priority = Priority.High;
                        else if (daysRemaining <= 7) task.Priority = Priority.Medium;
                        else task.Priority = Priority.Low;
                    }

                    // 4. Thêm stoppingToken vào đây
                    await db.SaveChangesAsync(stoppingToken);
                }

                await System.Threading.Tasks.Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}