using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<Student?> GetByIdAsync(int id);
        Task<Student?> GetByEmailAsync(string email);
        Task<IEnumerable<Student>> GetAllAsync(int page, int pageSize);
        Task AddAsync(Student student);
        Task UpdateAsync(Student student);
        Task DeleteAsync(Student student);
        Task<int> CountAsync();
        Task<bool> StudentExistsAsync(int id);
    }
}