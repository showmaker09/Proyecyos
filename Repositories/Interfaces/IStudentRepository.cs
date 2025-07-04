using InscripcionApi.Models;

namespace InscripcionApi.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync(int page, int pageSize);
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student?> GetStudentByEmailAsync(string email);
        Task<Student?> GetStudentByUsernameAsync(string username);
        Task AddStudentAsync(Student student);
        Task UpdateStudentAsync(Student student);
        Task DeleteStudentAsync(int id);
        Task<bool> StudentExistsAsync(int id);
        Task<bool> StudentExistsByEmailAsync(string email);
        Task<bool> StudentExistsByUsernameAsync(string username);
    }
}