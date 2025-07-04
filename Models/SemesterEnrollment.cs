using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InscripcionApi.Models
{
    public class SemesterEnrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGenerated.Identity)]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }
        public Student? Student { get; set; } // Propiedad de navegación

        [Required]
        [StringLength(100)]
        public string SemesterName { get; set; } = string.Empty;

        [Required]
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Range(1, 30)] // Un rango razonable para créditos máximos
        public int MaxCreditHours { get; set; }

        [Required]
        [Range(0, 30)]
        public int CurrentCreditHours { get; private set; } // Calculado, solo lectura externa

        // Propiedades de navegación
        public ICollection<EnrolledCourse> EnrolledCourses { get; set; } = new List<EnrolledCourse>();

        public SemesterEnrollment() { } // Constructor necesario para EF Core

        public SemesterEnrollment(int studentId, string semesterName, int maxCreditHours)
        {
            StudentId = studentId;
            SemesterName = semesterName;
            MaxCreditHours = maxCreditHours;
            CurrentCreditHours = 0; // Se inicializa en 0 al crear
        }

        /// <summary>
        /// Intenta añadir un curso a la inscripción.
        /// Aplica la regla de negocio crítica: no permite superar MaxCreditHours.
        /// </summary>
        /// <param name="course">El curso a inscribir.</param>
        /// <returns>True si el curso fue añadido exitosamente, false en caso contrario.</returns>
        /// <exception cref="InvalidOperationException">Si la suma de créditos excede el límite.</exception>
        public void AddCourse(EnrolledCourse course)
        {
            if (course == null)
            {
                throw new ArgumentNullException(nameof(course), "El curso a inscribir no puede ser nulo.");
            }

            if (CurrentCreditHours + course.CreditHours > MaxCreditHours)
            {
                throw new InvalidOperationException(
                    $"No se puede inscribir el curso '{course.CourseName}' porque excede el límite de créditos. " +
                    $"Créditos actuales: {CurrentCreditHours}, Créditos a añadir: {course.CreditHours}, Límite: {MaxCreditHours}."
                );
            }

            EnrolledCourses.Add(course);
            CurrentCreditHours += course.CreditHours;
        }

        // Podrías añadir un método para remover cursos y ajustar CurrentCreditHours
        public void RemoveCourse(EnrolledCourse course)
        {
            if (EnrolledCourses.Remove(course))
            {
                CurrentCreditHours -= course.CreditHours;
            }
        }
    }
}