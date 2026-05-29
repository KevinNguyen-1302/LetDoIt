using LetDoIt.Api.Data;
using LetDoIt.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LetDoIt.Api.DTOs;

namespace LetDoIt.Api.Services
{
    public class SessionService : ISessionService
    {
        private readonly LetDoItContext _context;
        public SessionService(LetDoItContext context)
        {
            _context = context;
        }
        public async Task<Session> SaveCompletedSessionAsync(CreateSessionRequestDto request, ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Token không chứa UserId hợp lệ!");
            }

            if (request.TaskId.HasValue)
            {
                var isTaskOwnedByUser = await _context.Tasks
                    .AnyAsync(t => t.TaskId == request.TaskId.Value && t.CreatedBy == userId);

                if (!isTaskOwnedByUser)
                {
                    throw new UnauthorizedAccessException("Task này không tồn tại hoặc bạn không có quyền thao tác!");
                }
            }

            var startUtc = request.StartTime.ToUniversalTime();
            var endUtc = request.EndTime.ToUniversalTime();
            var nowUtc = DateTime.UtcNow;

            if (endUtc > nowUtc.AddMinutes(1))
            {
                throw new InvalidOperationException("Hack vừa thôi bro, thời gian kết thúc không thể ở tương lai!");
            }

            var actualMinutes = (endUtc - startUtc).TotalMinutes;
            if (actualMinutes < (int)request.EndTime.Subtract(request.StartTime).TotalMinutes - 2)
            {
                // Ví dụ: Làm có 5 phút mà đòi nhận 25 phút
                throw new InvalidOperationException("Ăn gian nè! Thời gian thực tế ngắn hơn thời gian Pomodoro.");
            }

            var hasOverlappingSession = await _context.Sessions
        .AnyAsync(s => s.UserId == userId
                    && s.Status == SessionStatus.Completed
                    // Công thức tìm Overlap: (StartA < EndB) VÀ (EndA > StartB)
                    && s.StartTime < endUtc
                    && s.EndTime > startUtc);

            if (hasOverlappingSession)
            {
                throw new InvalidOperationException("Phát hiện tà thuật! Bạn đã có một phiên làm việc khác trong khoảng thời gian này rồi.");
            }

            var newSession = new Session
            {
                UserId = userId,
                TaskId = request.TaskId,
                StartTime = request.StartTime.ToUniversalTime(),
                EndTime = request.EndTime.ToUniversalTime(),
                Duration = (int)request.EndTime.Subtract(request.StartTime).TotalMinutes,
                Status = SessionStatus.Completed // Vì gọi hàm này lúc hoàn thành 25 phút, Status chắc chắn là Completed
            };

            // 4. Lưu xuống Database
            _context.Sessions.Add(newSession);
            await _context.SaveChangesAsync();

            return newSession;
        }
    }
}
