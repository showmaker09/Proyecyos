// MiMangaBot.Api/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using MiMangaBot.Services;
using MiMangaBot.Api.Models; // Necesario para LoginRequest
using System.Threading.Tasks;

namespace MiMangaBot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        // Pasa el nombre de usuario y la contraseña en texto plano al servicio de autenticación
        var token = await _authService.Authenticate(model.Username, model.Password);

        if (token == null)
        {
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        return Ok(new { token });
    }
}