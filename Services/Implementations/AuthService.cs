using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace InscripcionApi.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IStudentRepository studentRepository, IConfiguration configuration)
        {
            _studentRepository = studentRepository;
            _configuration = configuration;
        }

        public async Task<string?> AuthenticateStudent(string username, string password) // Cambiado de email a username
        {
            var student = await _studentRepository.GetStudentByUsernameAsync(username); // Buscar por username
            if (student == null || !VerifyPasswordHash(password, student.PasswordHash, student.PasswordSalt))
            {
                return null; // Credenciales inválidas
            }

            // Generar JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured."));
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
                new Claim(ClaimTypes.Email, student.Email),
                new Claim(ClaimTypes.Name, student.Username), // Añadir username al claim
                new Claim(ClaimTypes.Role, student.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token válido por 1 hora
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = issuer,
                Audience = audience
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);
            return (Encoding.UTF8.GetBytes(hashedPassword), Encoding.UTF8.GetBytes(salt));
        }

        public bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            try
            {
                string storedSaltString = Encoding.UTF8.GetString(storedSalt);
                string storedHashString = Encoding.UTF8.GetString(storedHash);
                return BCrypt.Net.BCrypt.Verify(password, storedHashString);
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}