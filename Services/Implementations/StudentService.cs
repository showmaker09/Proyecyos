using AutoMapper;
using InscripcionApi.Dtos.Students;
using InscripcionApi.Models;
using InscripcionApi.Repositories.Interfaces;
using InscripcionApi.Services.Interfaces;

namespace InscripcionApi.Services.Implementations
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IAuthService _authService; // Para hashear contraseñas
        private readonly IMapper _mapper;

        public StudentService(IStudentRepository studentRepository, IAuthService authService, IMapper mapper)
        {
            _studentRepository = studentRepository;
            _authService = authService;
            _mapper = mapper;
        }

        public async Task<StudentResponseDto?> RegisterStudentAsync(StudentCreateDto studentDto)
        {
            // Verificar si el correo ya existe
            if (await _studentRepository.StudentExistsByEmailAsync(studentDto.Email))
            {
                throw new InvalidOperationException($"El email '{studentDto.Email}' ya está registrado.");
            }
            // Verificar si el nombre de usuario ya existe
            if (await _studentRepository.StudentExistsByUsernameAsync(studentDto.Username))
            {
                throw new InvalidOperationException($"El nombre de usuario '{studentDto.Username}' ya está en uso.");
            }

            // Hashear la contraseña
            var (passwordHash, passwordSalt) = _authService.CreatePasswordHash(studentDto.Password);

            var student = new Student
            {
                Username = studentDto.Username,
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                Email = studentDto.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Role = "Estudiante" // Rol por defecto
            };

            await _studentRepository.AddStudentAsync(student);

            return _mapper.Map<StudentResponseDto>(student);
        }

        public async Task<IEnumerable<StudentResponseDto>> GetAllStudentsAsync(int page, int pageSize)
        {
            var students = await _studentRepository.GetAllStudentsAsync(page, pageSize);
            return _mapper.Map<IEnumerable<StudentResponseDto>>(students);
        }

        public async Task<StudentResponseDto?> GetStudentByIdAsync(int id)
        {
            var student = await _studentRepository.GetStudentByIdAsync(id);
            return _mapper.Map<StudentResponseDto>(student);
        }

        public async Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto studentDto)
        {
            var existingStudent = await _studentRepository.GetStudentByIdAsync(id);
            if (existingStudent == null)
            {
                return null; // Estudiante no encontrado
            }

            // Actualizar solo los campos proporcionados
            if (studentDto.FirstName != null)
            {
                existingStudent.FirstName = studentDto.FirstName;
            }
            if (studentDto.LastName != null)
            {
                existingStudent.LastName = studentDto.LastName;
            }
            if (studentDto.Email != null)
            {
                // Verificar si el nuevo email ya existe y no es el del propio estudiante
                if (existingStudent.Email != studentDto.Email && await _studentRepository.StudentExistsByEmailAsync(studentDto.Email))
                {
                    throw new InvalidOperationException($"El email '{studentDto.Email}' ya está registrado por otro estudiante.");
                }
                existingStudent.Email = studentDto.Email;
            }

            await _studentRepository.UpdateStudentAsync(existingStudent);
            return _mapper.Map<StudentResponseDto>(existingStudent);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var studentExists = await _studentRepository.StudentExistsAsync(id);
            if (!studentExists)
            {
                return false;
            }
            await _studentRepository.DeleteStudentAsync(id);
            return true;
        }
    }
}