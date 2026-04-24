namespace LetDoIt.Api.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync();
        Task<string?> LoginAsync(string username, string password);

    }
}
