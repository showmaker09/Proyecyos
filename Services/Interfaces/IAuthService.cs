using InscripcionApi.Dtos.Auth;

namespace InscripcionApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string?> AuthenticateAsync(LoginDto loginDto);
    }
}