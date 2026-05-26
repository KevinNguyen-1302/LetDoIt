namespace LetDoIt.Api.Response
{
    public class BusinessException(int errorCode, string message, int statusCode = 400) : Exception(message)
    {
        public int ErrorCode { get; } = errorCode;
        public int StatusCode { get; } = statusCode;
    }
}