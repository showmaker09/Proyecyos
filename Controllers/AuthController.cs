using InscripcionApi.Dtos.Auth;
using InscripcionApi.Services.Interfaces;
using InscripcionApi.Security; // Para el filtro de IP
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InscripcionApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Autentica a un usuario estudiante y devuelve un token JWT.
        /// Este endpoint está protegido por la restricción de IP.
        /// </summary>
        /// <param name="loginDto">Credenciales de login del estudiante.</param>
        /// <returns>Token JWT si la autenticación es exitosa.</returns>
        [HttpPost("login")]
        //[ServiceFilter(typeof(IpRestrictionAttribute))] // Aplicar el filtro de IP
        [AllowAnonymous] // Permitir acceso sin autorización previa
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation($"Intento de login para usuario: {loginDto.Username} desde IP: {HttpContext.Connection.RemoteIpAddress}");

            var token = await _authService.AuthenticateAsync(loginDto);

            if (token == null)
            {
                _logger.LogWarning($"Fallo de login para usuario: {loginDto.Username}");
                return Unauthorized(new { message = "Credenciales inválidas." });
            }

            _logger.LogInformation($"Login exitoso para usuario: {loginDto.Username}");
            return Ok(new { token });
        }
    }
}