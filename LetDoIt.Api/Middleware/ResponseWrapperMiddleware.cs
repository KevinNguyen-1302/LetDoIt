using LetDoIt.Api.Response;
using System.Text.Json;
using System.Text.Json.Serialization;

public class ResponseWrapperMiddleware
{
    private readonly RequestDelegate _next;
    private readonly JsonSerializerOptions _jsonOptions;

    public ResponseWrapperMiddleware(RequestDelegate next)
    {
        _next = next;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = { new JsonStringEnumConverter() }
        };
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Lưu lại original response stream (không thể đọc được sau khi ghi)
        var originalBodyStream = context.Response.Body;

        // Tạo memory stream mới để catch response body
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        try
        {
            // Gọi controller handler (middleware tiếp theo)
            await _next(context);

            // Lấy response body đã được ghi
            responseBody.Seek(0, SeekOrigin.Begin);
            var bodyText = await new StreamReader(responseBody).ReadToEndAsync();

            // Nếu là success response (status code 200-299)
            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                // Parse response body thành object
                var data = string.IsNullOrEmpty(bodyText)
                    ? null
                    : JsonSerializer.Deserialize<object>(bodyText, _jsonOptions);

                // Wrap vào ApiResponse format
                var wrappedResponse = ApiResponse<object?>.Success(data, "Success");
                var jsonResponse = JsonSerializer.Serialize(wrappedResponse, _jsonOptions);

                // Ghi response đã format vào original stream
                await originalBodyStream.WriteAsync(
                    System.Text.Encoding.UTF8.GetBytes(jsonResponse)
                );
            }
            else
            {
                // Nếu không phải success, ghi response ban đầu (error đã được middleware exception xử lý)
                await originalBodyStream.WriteAsync(
                    System.Text.Encoding.UTF8.GetBytes(bodyText)
                );
            }
        }
        finally
        {
            // Restore original response stream
            context.Response.Body = originalBodyStream;
        }
    }
}

