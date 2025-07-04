using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface ISemesterEnrollmentRepository
    {
        Task<IEnumerable<SemesterEnrollment>> GetAllEnrollmentsAsync(int page, int pageSize);
        Task<SemesterEnrollment?> GetEnrollmentByIdAsync(int id);
        Task<SemesterEnrollment?> GetActiveEnrollmentByStudentIdAsync(int studentId);
        Task AddEnrollmentAsync(SemesterEnrollment enrollment);
        Task UpdateEnrollmentAsync(SemesterEnrollment enrollment);
        Task DeleteEnrollmentAsync(int id);
        Task<bool> EnrollmentExistsAsync(int id);
        Task SaveChangesAsync();
    }
}