using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface IEnrolledCourseRepository
    {
        Task<EnrolledCourse?> GetByIdAsync(int id);
        Task<IEnumerable<EnrolledCourse>> GetByEnrollmentIdAsync(int enrollmentId);
        Task AddAsync(EnrolledCourse enrolledCourse);
        Task UpdateAsync(EnrolledCourse enrolledCourse);
        Task DeleteAsync(EnrolledCourse enrolledCourse);
    }
}