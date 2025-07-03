using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InscripcionApi.Services.Implementations
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly ISemesterEnrollmentRepository _semesterEnrollmentRepository;
        private readonly IEnrolledCourseRepository _enrolledCourseRepository;
        private readonly IStudentRepository _studentRepository;

        public EnrollmentService(
            ISemesterEnrollmentRepository semesterEnrollmentRepository,
            IEnrolledCourseRepository enrolledCourseRepository,
            IStudentRepository studentRepository)
        {
            _semesterEnrollmentRepository = semesterEnrollmentRepository;
            _enrolledCourseRepository = enrolledCourseRepository;
            _studentRepository = studentRepository;
        }

        public async Task<SemesterEnrollmentResponseDto?> StartSemesterEnrollmentAsync(StartEnrollmentDto startDto)
        {
            // Regla de negocio crítica: El sistema no debe permitir agregar estudiantes que ya se encuentra inscrito a un semestre.
            var existingEnrollment = await _semesterEnrollmentRepository.GetActiveEnrollmentByStudentIdAsync(startDto.StudentId);
            if (existingEnrollment != null)
            {
                throw new InvalidOperationException($"El estudiante {startDto.StudentId} ya tiene una inscripción activa para el semestre '{existingEnrollment.SemesterName}'.");
            }

            var studentExists = await _studentRepository.StudentExistsAsync(startDto.StudentId);
            if (!studentExists)
            {
                throw new ArgumentException($"El estudiante con ID {startDto.StudentId} no existe.");
            }

            var newEnrollment = new SemesterEnrollment(startDto.StudentId, startDto.SemesterName, startDto.MaxCreditHours);

            await _semesterEnrollmentRepository.AddAsync(newEnrollment);

            return MapToSemesterEnrollmentResponseDto(newEnrollment);
        }

        public async Task<SemesterEnrollmentResponseDto?> EnrollCourseAsync(int enrollmentId, EnrollCourseDto enrollDto)
        {
            var enrollment = await _semesterEnrollmentRepository.GetByIdAsync(enrollmentId);

            if (enrollment == null)
            {
                throw new KeyNotFoundException($"Inscripción con ID {enrollmentId} no encontrada.");
            }

            var newEnrolledCourse = new EnrolledCourse(enrollDto.CourseName, enrollDto.CreditHours);
            newEnrolledCourse.SemesterEnrollmentId = enrollmentId; // Asegurarse de la FK

            // Regla de negocio crítica: La responsabilidad de esta validación debe residir dentro de la logica del dominio del agregado SemesterEnrollment.
            enrollment.AddCourse(newEnrolledCourse); // La validación de MaxCreditHours ocurre aquí

            // Si AddCourse no lanzó una excepción, podemos guardar
            await _enrolledCourseRepository.AddAsync(newEnrolledCourse); // Guardar el curso inscrito
            await _semesterEnrollmentRepository.UpdateAsync(enrollment); // Actualizar los CurrentCreditHours en la inscripción

            return MapToSemesterEnrollmentResponseDto(enrollment);
        }

        public async Task<SemesterEnrollmentResponseDto?> GetEnrollmentByIdAsync(int enrollmentId)
        {
            var enrollment = await _semesterEnrollmentRepository.GetByIdAsync(enrollmentId);
            return enrollment == null ? null : MapToSemesterEnrollmentResponseDto(enrollment);
        }

        public async Task<(IEnumerable<SemesterEnrollmentResponseDto>, int totalItems)> GetEnrollmentsByStudentIdAsync(int studentId, int page, int pageSize)
        {
            var enrollments = await _semesterEnrollmentRepository.GetAllByStudentIdAsync(studentId, page, pageSize);
            var totalItems = await _semesterEnrollmentRepository.CountByStudentIdAsync(studentId);

            return (enrollments.Select(MapToSemesterEnrollmentResponseDto), totalItems);
        }

        private SemesterEnrollmentResponseDto MapToSemesterEnrollmentResponseDto(SemesterEnrollment enrollment)
        {
            return new SemesterEnrollmentResponseDto
            {
                Id = enrollment.Id,
                StudentId = enrollment.StudentId,
                SemesterName = enrollment.SemesterName,
                EnrollmentDate = enrollment.EnrollmentDate,
                MaxCreditHours = enrollment.MaxCreditHours,
                CurrentCreditHours = enrollment.CurrentCreditHours,
                EnrolledCourses = enrollment.EnrolledCourses?
                    .Select(ec => new EnrolledCourseResponseDto
                    {
                        Id = ec.Id,
                        SemesterEnrollmentId = ec.SemesterEnrollmentId,
                        CourseName = ec.CourseName,
                        CreditHours = ec.CreditHours
                    }).ToList() ?? new List<EnrolledCourseResponseDto>()
            };
        }
    }
}