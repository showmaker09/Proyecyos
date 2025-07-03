using InscripcionApi.Dtos.Auth;
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

        public async Task<string?> AuthenticateAsync(LoginDto loginDto)
        {
            // Para el login, usamos el Email como username (asumiendo que el estudiante se loguea con su email)
            var student = await _studentRepository.GetByEmailAsync(loginDto.Username);

            if (student == null)
            {
                return null; // Usuario no encontrado
            }

            // Verificar la contraseña usando BCrypt
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, Encoding.UTF8.GetString(student.PasswordHash));

            if (!isPasswordValid)
            {
                return null; // Contraseña incorrecta
            }

            // Si las credenciales son válidas, generar JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured."));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
                new Claim(ClaimTypes.Email, student.Email),
                new Claim(ClaimTypes.Role, student.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["Jwt:ExpiresHours"] ?? "1")), // Token expira en X horas
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}