using InscripcionApi.Dtos.Students;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Interfaces;
using BCrypt.Net;

namespace InscripcionApi.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;

        public StudentService(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public async Task<StudentResponseDto?> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            return student == null ? null : MapToStudentResponseDto(student);
        }

        public async Task<(IEnumerable<StudentResponseDto>, int totalItems)> GetAllStudentsAsync(int page, int pageSize)
        {
            var students = await _studentRepository.GetAllAsync(page, pageSize);
            var totalItems = await _studentRepository.CountAsync();
            return (students.Select(MapToStudentResponseDto), totalItems);
        }

        public async Task<StudentResponseDto> CreateStudentAsync(StudentCreateDto createDto)
        {
            // Verificar si ya existe un estudiante con el mismo email
            var existingStudent = await _studentRepository.GetByEmailAsync(createDto.Email);
            if (existingStudent != null)
            {
                throw new ArgumentException("Ya existe un estudiante registrado con este email.");
            }

            // Hashear la contraseña
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password, BCrypt.Net.BCrypt.GenerateSalt());

            var student = new Student
            {
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                PasswordHash = System.Text.Encoding.UTF8.GetBytes(passwordHash),
                PasswordSalt = System.Text.Encoding.UTF8.GetBytes(BCrypt.Net.BCrypt.GenerateSalt()), // Se genera un salt para almacenar si es necesario
                Role = "Estudiante" // Rol por defecto
            };

            await _studentRepository.AddAsync(student);
            return MapToStudentResponseDto(student);
        }

        public async Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto updateDto)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return null; // Estudiante no encontrado
            }

            // Actualizar solo los campos proporcionados
            if (updateDto.FirstName != null)
            {
                student.FirstName = updateDto.FirstName;
            }
            if (updateDto.LastName != null)
            {
                student.LastName = updateDto.LastName;
            }
            if (updateDto.Email != null)
            {
                // Opcional: verificar si el nuevo email ya está en uso por otro estudiante
                var existingStudentWithNewEmail = await _studentRepository.GetByEmailAsync(updateDto.Email);
                if (existingStudentWithNewEmail != null && existingStudentWithNewEmail.Id != id)
                {
                    throw new ArgumentException("El nuevo email ya está en uso por otro estudiante.");
                }
                student.Email = updateDto.Email;
            }

            await _studentRepository.UpdateAsync(student);
            return MapToStudentResponseDto(student);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return false; // Estudiante no encontrado
            }

            await _studentRepository.DeleteAsync(student);
            return true;
        }

        private StudentResponseDto MapToStudentResponseDto(Student student)
        {
            return new StudentResponseDto
            {
                Id = student.Id,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Email = student.Email,
                Role = student.Role
            };
        }
    }
}