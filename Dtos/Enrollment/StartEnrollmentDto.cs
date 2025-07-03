using System.ComponentModel.DataAnnotations;

namespace InscripcionApi.Dtos.Enrollment
{
    public class StartEnrollmentDto
    {
        [Required(ErrorMessage = "El ID del estudiante es requerido.")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "El nombre del semestre es requerido.")]
        [StringLength(100, ErrorMessage = "El nombre del semestre no puede exceder 100 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\s-]+$", ErrorMessage = "El nombre del semestre solo puede contener letras, números, espacios y guiones.")]
        public string SemesterName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El límite de créditos es requerido.")]
        [Range(1, 30, ErrorMessage = "El límite de créditos debe ser entre 1 y 30.")]
        public int MaxCreditHours { get; set; }
    }
}