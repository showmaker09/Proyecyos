using InscripcionApi.Dtos.Students;
using InscripcionApi.Models;

namespace InscripcionApi.Services.Interfaces
{
    public interface IStudentService
    {
        Task<StudentResponseDto?> RegisterStudentAsync(StudentCreateDto studentDto);
        Task<IEnumerable<StudentResponseDto>> GetAllStudentsAsync(int page, int pageSize);
        Task<StudentResponseDto?> GetStudentByIdAsync(int id);
        Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto studentDto);
        Task<bool> DeleteStudentAsync(int id);
    }
}