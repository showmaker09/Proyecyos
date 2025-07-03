using System.ComponentModel.DataAnnotations;

namespace InscripcionApi.Dtos.Auth
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        public string Password { get; set; } = string.Empty;
    }
}