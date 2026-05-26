using LetDoIt.Api.Response;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        int statusCode = 500;
        int errorCode = 9999; // Lỗi hệ thống mặc định
        string message = "Đã có lỗi hệ thống xảy ra.";

        if (exception is BusinessException bizEx)
        {
            statusCode = bizEx.StatusCode;
            errorCode = bizEx.ErrorCode;
            message = bizEx.Message;
        }
        else
        {
            // Có thể log lỗi thực tế ở đây (NLog, Serilog...)
            message = exception.Message; // Hoặc ẩn đi ở môi trường Production
        }

        context.Response.StatusCode = statusCode;
        
        var response = ApiResponse<object>.Fail(errorCode, message);
        return context.Response.WriteAsJsonAsync(response);
    }
}