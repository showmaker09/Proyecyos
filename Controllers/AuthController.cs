// Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using MiUtilsApi.Services;

namespace MiUtilsApi.Controllers
{
    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Inicia sesión de usuario y devuelve un token JWT.
        /// POST: api/Auth/login
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Usuario y contraseña son requeridos.");
            }

            var token = await _authService.Authenticate(request.Username, request.Password);

            if (token == null)
            {
                return Unauthorized("Credenciales inválidas.");
            }

            return Ok(new { Token = token });
        }
    }
}
