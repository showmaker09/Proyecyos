using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Models;

namespace InscripcionApi.Services.Interfaces
{
    public interface IEnrollmentService
    {
        Task<SemesterEnrollmentResponseDto?> StartSemesterEnrollmentAsync(StartEnrollmentDto startDto);
        Task<SemesterEnrollmentResponseDto?> EnrollCourseAsync(int enrollmentId, EnrollCourseDto enrollDto);
        Task<SemesterEnrollmentResponseDto?> GetEnrollmentByIdAsync(int enrollmentId);
        Task<(IEnumerable<SemesterEnrollmentResponseDto>, int totalItems)> GetEnrollmentsByStudentIdAsync(int studentId, int page, int pageSize);
    }
}