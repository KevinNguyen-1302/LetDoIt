namespace LetDoIt.Api.Response
{
    public class ApiResponse<T>
    {
        public string Result { get; set; } = "success";
        public int Error { get; set; } = 0;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; } // Chỗ này để chứa dữ liệu trả về (nếu có)

        // Helper tạo nhanh response thành công
        public static ApiResponse<T> Success(T data, string message = "") => new()
        {
            Result = "success",
            Data = data,
            Message = message
        };

        // Helper tạo nhanh response thất bại
        public static ApiResponse<object> Fail(int errorCode, string message) => new()
        {
            Result = "fail",
            Error = errorCode,
            Message = message,
            Data = null
        };
    }
}