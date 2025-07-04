using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InscripcionApi.Models
{
    public class EnrolledCourse
    {
        [Key]
        [DatabaseGenerated(DatabaseGenerated.Identity)]
        public int Id { get; set; }

        [Required]
        public int SemesterEnrollmentId { get; set; }
        public SemesterEnrollment? SemesterEnrollment { get; set; } // Propiedad de navegación

        [Required]
        [StringLength(150)]
        public string CourseName { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)] // Un curso no debería tener menos de 1 crédito ni más de 10
        public int CreditHours { get; set; }

        public EnrolledCourse() { } // Constructor necesario para EF Core

        public EnrolledCourse(string courseName, int creditHours)
        {
            CourseName = courseName;
            CreditHours = creditHours;
        }
    }
}