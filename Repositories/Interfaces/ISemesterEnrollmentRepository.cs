using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface ISemesterEnrollmentRepository
    {
        Task<SemesterEnrollment?> GetByIdAsync(int id);
        Task<SemesterEnrollment?> GetActiveEnrollmentByStudentIdAsync(int studentId);
        Task<IEnumerable<SemesterEnrollment>> GetAllByStudentIdAsync(int studentId, int page, int pageSize);
        Task AddAsync(SemesterEnrollment enrollment);
        Task UpdateAsync(SemesterEnrollment enrollment);
        Task DeleteAsync(SemesterEnrollment enrollment);
        Task<int> CountByStudentIdAsync(int studentId);
    }
}