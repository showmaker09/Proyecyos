using InscripcionApi.Dtos.Students;
using InscripcionApi.Models;

namespace InscripcionApi.Services.Interfaces
{
    public interface IStudentService
    {
        Task<StudentResponseDto?> GetStudentByIdAsync(int id);
        Task<(IEnumerable<StudentResponseDto>, int totalItems)> GetAllStudentsAsync(int page, int pageSize);
        Task<StudentResponseDto> CreateStudentAsync(StudentCreateDto createDto);
        Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto updateDto);
        Task<bool> DeleteStudentAsync(int id);
    }
}