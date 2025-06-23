// MiMangaBot.Api/Models/LoginRequest.cs (CORRECTO para la solicitud de inicio de sesión de la API)
using System.ComponentModel.DataAnnotations; // Para [Required]

namespace MiMangaBot.Api.Models;

public class LoginRequest
{
    [Required(ErrorMessage = "El nombre de usuario es requerido.")]
    public string Username { get; set; } = string.Empty;

    // Esta es la contraseña en TEXTO PLANO que el usuario introduce.
    // NUNCA se almacena directamente en la base de datos.
    [Required(ErrorMessage = "La contraseña es requerida.")]
    public string Password { get; set; } = string.Empty;
}