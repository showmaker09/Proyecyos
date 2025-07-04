using InscripcionApi.Dtos.Auth;
using InscripcionApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InscripcionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            _logger.LogInformation("Intentando iniciar sesión para el usuario: {Username}", loginDto.Username);

            var token = await _authService.AuthenticateStudent(loginDto.Username, loginDto.Password);

            if (token == null)
            {
                _logger.LogWarning("Autenticación fallida para el usuario: {Username}", loginDto.Username);
                return Unauthorized("Credenciales inválidas.");
            }

            _logger.LogInformation("Usuario {Username} autenticado exitosamente.", loginDto.Username);
            return Ok(new { Token = token });
        }
    }
}