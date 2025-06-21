// MiMangaBot.Services/AuthService.cs
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MiMangaBot.Domain;
using MiMangaBot.Infrastructure;
using Microsoft.Extensions.Configuration;
using BCrypt.Net; // <-- ¡ESENCIAL para la verificación de contraseñas!

namespace MiMangaBot.Services;

public class AuthService
{
    private readonly IConfiguration _configuration;
    private readonly UsuarioRepository _userRepository;

    public AuthService(IConfiguration configuration, UsuarioRepository userRepository)
    {
        _configuration = configuration;
        _userRepository = userRepository;
    }

    public async Task<string?> Authenticate(string username, string password)
    {
        // 1. Obtener usuario de la base de datos
        var user = await _userRepository.GetByUsername(username);

        // 2. Verificar contraseña usando BCrypt.Net.BCrypt.Verify
        // 'password' es la contraseña en texto plano del LoginRequest
        // 'user.PasswordHash' es la contraseña hasheada de la base de datos
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return null; // Credenciales inválidas
        }

        // 3. Generar el JWT si las credenciales son válidas
        var tokenHandler = new JwtSecurityTokenHandler();
        // Esta línea es crítica: si Jwt:Key no está en appsettings.json, lanzará una excepción
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured."));

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role) // Añadir el rol del usuario como un claim
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // El token expira en 1 hora
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],    // Emisor del token
            Audience = _configuration["Jwt:Audience"]  // Audiencia del token (Nota: Usé Audience aquí, es mejor que Issuer si son diferentes)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token); // Retornar el token como un string
    }
}