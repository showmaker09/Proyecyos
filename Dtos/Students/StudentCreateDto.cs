using System.ComponentModel.DataAnnotations;

namespace InscripcionApi.Dtos.Students
{
    public class StudentCreateDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido.")]
        [StringLength(50, ErrorMessage = "El nombre de usuario no puede exceder 50 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "El nombre de usuario solo puede contener letras y números.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El nombre solo puede contener letras y espacios.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es requerido.")]
        [StringLength(100, ErrorMessage = "El apellido no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El apellido solo puede contener letras y espacios.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es requerido.")]
        [EmailAddress(ErrorMessage = "El email no es una dirección válida.")]
        [StringLength(150, ErrorMessage = "El email no puede exceder 150 caracteres.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es requerida.")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;
    }
}