using InscripcionApi.Models;

namespace InscripcionApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string?> AuthenticateStudent(string username, string password); // Cambiado a username
        (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password);
        bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt);
    }
}