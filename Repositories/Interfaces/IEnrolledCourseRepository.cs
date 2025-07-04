using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface IEnrolledCourseRepository
    {
        Task<IEnumerable<EnrolledCourse>> GetCoursesByEnrollmentIdAsync(int enrollmentId);
        Task<EnrolledCourse?> GetEnrolledCourseByIdAsync(int id);
        Task AddEnrolledCourseAsync(EnrolledCourse enrolledCourse);
        Task UpdateEnrolledCourseAsync(EnrolledCourse enrolledCourse);
        Task DeleteEnrolledCourseAsync(int id);
        Task<bool> EnrolledCourseExistsAsync(int id);
    }
}