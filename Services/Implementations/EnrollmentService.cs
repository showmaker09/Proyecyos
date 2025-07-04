using AutoMapper;
using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Interfaces;

namespace InscripcionApi.Services.Implementations
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly ISemesterEnrollmentRepository _semesterEnrollmentRepository;
        private readonly IEnrolledCourseRepository _enrolledCourseRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IMapper _mapper;

        public EnrollmentService(
            ISemesterEnrollmentRepository semesterEnrollmentRepository,
            IEnrolledCourseRepository enrolledCourseRepository,
            IStudentRepository studentRepository,
            IMapper mapper)
        {
            _semesterEnrollmentRepository = semesterEnrollmentRepository;
            _enrolledCourseRepository = enrolledCourseRepository;
            _studentRepository = studentRepository;
            _mapper = mapper;
        }

        public async Task<SemesterEnrollmentResponseDto?> StartSemesterEnrollmentAsync(StartEnrollmentDto startEnrollmentDto)
        {
            // Regla de negocio: No permitir si el estudiante ya tiene una inscripción activa.
            var existingEnrollment = await _semesterEnrollmentRepository.GetActiveEnrollmentByStudentIdAsync(startEnrollmentDto.StudentId);
            if (existingEnrollment != null)
            {
                throw new InvalidOperationException($"El estudiante con ID {startEnrollmentDto.StudentId} ya tiene una inscripción semestral activa.");
            }

            var studentExists = await _studentRepository.StudentExistsAsync(startEnrollmentDto.StudentId);
            if (!studentExists)
            {
                throw new ArgumentException($"El estudiante con ID {startEnrollmentDto.StudentId} no existe.");
            }

            var newEnrollment = new SemesterEnrollment(
                startEnrollmentDto.StudentId,
                startEnrollmentDto.SemesterName,
                startEnrollmentDto.MaxCreditHours
            );

            await _semesterEnrollmentRepository.AddEnrollmentAsync(newEnrollment);

            return _mapper.Map<SemesterEnrollmentResponseDto>(newEnrollment);
        }

        public async Task<EnrolledCourseResponseDto?> EnrollCourseAsync(int enrollmentId, EnrollCourseDto enrollCourseDto)
        {
            var semesterEnrollment = await _semesterEnrollmentRepository.GetEnrollmentByIdAsync(enrollmentId);
            if (semesterEnrollment == null)
            {
                throw new ArgumentException($"No se encontró una inscripción semestral con ID {enrollmentId}.");
            }

            var newEnrolledCourse = new EnrolledCourse(
                enrollCourseDto.CourseName,
                enrollCourseDto.CreditHours
            );

            // La lógica crítica de MaxCreditHours se maneja dentro del modelo de dominio SemesterEnrollment
            try
            {
                semesterEnrollment.AddCourse(newEnrolledCourse);
            }
            catch (InvalidOperationException ex)
            {
                // Re-lanzar la excepción para que el controlador la capture y devuelva un BadRequest
                throw new InvalidOperationException($"Error al inscribir el curso: {ex.Message}", ex);
            }

            // Asignar el ID de la inscripción antes de guardar el curso
            newEnrolledCourse.SemesterEnrollmentId = enrollmentId;

            // Guardar el curso inscrito y actualizar la inscripción del semestre (CurrentCreditHours)
            await _enrolledCourseRepository.AddEnrolledCourseAsync(newEnrolledCourse);
            await _semesterEnrollmentRepository.UpdateEnrollmentAsync(semesterEnrollment); // Para persistir CurrentCreditHours

            return _mapper.Map<EnrolledCourseResponseDto>(newEnrolledCourse);
        }

        public async Task<SemesterEnrollmentResponseDto?> GetSemesterEnrollmentByIdAsync(int enrollmentId)
        {
            var enrollment = await _semesterEnrollmentRepository.GetEnrollmentByIdAsync(enrollmentId);
            return _mapper.Map<SemesterEnrollmentResponseDto>(enrollment);
        }

        public async Task<IEnumerable<SemesterEnrollmentResponseDto>> GetAllSemesterEnrollmentsAsync(int page, int pageSize)
        {
            var enrollments = await _semesterEnrollmentRepository.GetAllEnrollmentsAsync(page, pageSize);
            return _mapper.Map<IEnumerable<SemesterEnrollmentResponseDto>>(enrollments);
        }

        public async Task<bool> DeleteSemesterEnrollmentAsync(int enrollmentId)
        {
            var enrollmentExists = await _semesterEnrollmentRepository.EnrollmentExistsAsync(enrollmentId);
            if (!enrollmentExists)
            {
                return false;
            }
            await _semesterEnrollmentRepository.DeleteEnrollmentAsync(enrollmentId);
            return true;
        }

        public async Task<bool> RemoveEnrolledCourseAsync(int enrollmentId, int enrolledCourseId)
        {
            var semesterEnrollment = await _semesterEnrollmentRepository.GetEnrollmentByIdAsync(enrollmentId);
            if (semesterEnrollment == null)
            {
                throw new ArgumentException($"No se encontró una inscripción semestral con ID {enrollmentId}.");
            }

            var enrolledCourse = semesterEnrollment.EnrolledCourses.FirstOrDefault(ec => ec.Id == enrolledCourseId);
            if (enrolledCourse == null)
            {
                return false; // El curso inscrito no existe en esta inscripción
            }

            semesterEnrollment.RemoveCourse(enrolledCourse);
            await _enrolledCourseRepository.DeleteEnrolledCourseAsync(enrolledCourseId); // Eliminar de la base de datos
            await _semesterEnrollmentRepository.UpdateEnrollmentAsync(semesterEnrollment); // Actualizar CurrentCreditHours
            return true;
        }
    }
}