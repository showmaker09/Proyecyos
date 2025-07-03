using System.ComponentModel.DataAnnotations;

namespace InscripcionApi.Dtos.Students
{
    public class StudentUpdateDto
    {
        [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El nombre solo puede contener letras y espacios.")]
        public string? FirstName { get; set; }

        [StringLength(100, ErrorMessage = "El apellido no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "El apellido solo puede contener letras y espacios.")]
        public string? LastName { get; set; }

        [EmailAddress(ErrorMessage = "El email no es una dirección válida.")]
        [StringLength(150, ErrorMessage = "El email no puede exceder 150 caracteres.")]
        public string? Email { get; set; }
    }
}