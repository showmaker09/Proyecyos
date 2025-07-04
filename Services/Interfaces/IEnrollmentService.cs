using InscripcionApi.Dtos.Enrollment;
using InscripcionApi.Models;

namespace InscripcionApi.Services.Interfaces
{
    public interface IEnrollmentService
    {
        Task<SemesterEnrollmentResponseDto?> StartSemesterEnrollmentAsync(StartEnrollmentDto startEnrollmentDto);
        Task<EnrolledCourseResponseDto?> EnrollCourseAsync(int enrollmentId, EnrollCourseDto enrollCourseDto);
        Task<SemesterEnrollmentResponseDto?> GetSemesterEnrollmentByIdAsync(int enrollmentId);
        Task<IEnumerable<SemesterEnrollmentResponseDto>> GetAllSemesterEnrollmentsAsync(int page, int pageSize);
        Task<bool> DeleteSemesterEnrollmentAsync(int enrollmentId);
        Task<bool> RemoveEnrolledCourseAsync(int enrollmentId, int enrolledCourseId);
    }
}