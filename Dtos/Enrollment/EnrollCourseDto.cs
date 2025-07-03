using System.ComponentModel.DataAnnotations;

namespace InscripcionApi.Dtos.Enrollment
{
    public class EnrollCourseDto
    {
        [Required(ErrorMessage = "El nombre del curso es requerido.")]
        [StringLength(150, ErrorMessage = "El nombre del curso no puede exceder 150 caracteres.")]
        [RegularExpression(@"^[a-zA-Z0-9\s\.\-&]+$", ErrorMessage = "El nombre del curso solo puede contener letras, números, espacios, puntos, guiones y ampersand.")]
        public string CourseName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Las horas de crédito del curso son requeridas.")]
        [Range(1, 10, ErrorMessage = "Las horas de crédito deben ser entre 1 y 10.")]
        public int CreditHours { get; set; }
    }
}