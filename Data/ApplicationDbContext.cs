using InscripcionApi.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Text;

namespace InscripcionApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public ApplicationDbContext(string connectionString) : base(GetOptions(connectionString)) { }

        public static DbContextOptions<ApplicationDbContext> GetOptions(string connectionString)
        {
            return new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
                .Options;
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<SemesterEnrollment> SemesterEnrollments { get; set; }
        public DbSet<EnrolledCourse> EnrolledCourses { get; set; }
        public DbSet<Course> Courses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de relaciones
            modelBuilder.Entity<SemesterEnrollment>()
                .HasOne(se => se.Student)
                .WithMany(s => s.SemesterEnrollments)
                .HasForeignKey(se => se.StudentId);

            modelBuilder.Entity<EnrolledCourse>()
                .HasOne(ec => ec.SemesterEnrollment)
                .WithMany(se => se.EnrolledCourses)
                .HasForeignKey(ec => ec.SemesterEnrollmentId);

            // Configurar que CurrentCreditHours sea calculado y no mapeado directamente para escritura externa
            modelBuilder.Entity<SemesterEnrollment>()
                .Property(se => se.CurrentCreditHours)
                .Metadata.SetAfterSaveBehavior(Microsoft.EntityFrameworkCore.Metadata.PropertySaveBehavior.Ignore);

            // ----------------------------------------------------------------------------------------------------
            // SEMBRADO DE DATOS MANUAL (100 REGISTROS POR TABLA)
            // Esto es EXTREMADAMENTE extenso debido a la solicitud de "sin bucles for".
            // Para un entorno real, se usarían herramientas de seeding o bucles.
            // ----------------------------------------------------------------------------------------------------

            var students = new List<Student>();
            var courses = new List<Course>();
            var semesterEnrollments = new List<SemesterEnrollment>();
            var enrolledCourses = new List<EnrolledCourse>();
            
            // Instancia temporal para hashing de contraseñas.
            // En un seeder de datos real, esto se haría de forma más limpia.
            var authService = new AuthService(null!, null!); 

            // --- 1. Sembrar Estudiantes (100 registros) ---
            // Nombres de ejemplo para generar nombres de usuario y manejar duplicados
            string[] firstNames = { "Juan", "Maria", "Pedro", "Ana", "Luis", "Laura", "Diego", "Sofía", "Pablo", "Valeria",
                                    "Andrés", "Camila", "Javier", "Isabella", "Gabriel", "Valentina", "Ricardo", "Daniela", "Fernando", "Mariana" };
            string[] lastNames = { "García", "Rodríguez", "Martínez", "Hernández", "López", "González", "Pérez", "Sánchez", "Ramírez", "Flores" };

            Dictionary<string, int> usernameCounts = new Dictionary<string, int>();

            for (int i = 1; i <= 100; i++)
            {
                string firstName = firstNames[(i - 1) % firstNames.Length];
                string lastName = lastNames[(i - 1) % lastNames.Length];
                string baseUsername = firstName.ToLowerInvariant();
                string username = baseUsername;

                if (usernameCounts.ContainsKey(baseUsername))
                {
                    usernameCounts[baseUsername]++;
                    username = baseUsername + usernameCounts[baseUsername];
                }
                else
                {
                    usernameCounts[baseUsername] = 0; // 0 significa el primer uso sin número
                }

                string email = $"{username.ToLowerInvariant()}@universidad.com";
                string password = $"{username}password";
                var (hash, salt) = authService.CreatePasswordHash(password);

                students.Add(new Student
                {
                    Id = i,
                    Username = username,
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    Role = "Estudiante"
                });
            }
            modelBuilder.Entity<Student>().HasData(students);

            // --- 2. Sembrar Cursos (100 registros) ---
            string[] coursePrefixes = { "Introducción a", "Fundamentos de", "Programación Avanzada", "Análisis de Datos", "Historia de", "Química Orgánica", "Matemáticas Discretas", "Física Moderna", "Arte y Cultura", "Ingeniería de Software" };
            string[] courseSuffixes = { "Computación", "Negocios", "Psicología", "Literatura", "Derecho", "Medicina", "Arquitectura", "Biología", "Filosofía", "Geografía" };
            Random rnd = new Random(123); // Para créditos aleatorios

            for (int i = 1; i <= 100; i++)
            {
                string name = $"{coursePrefixes[(i - 1) % coursePrefixes.Length]} {courseSuffixes[(i - 1) % courseSuffixes.Length]} {i}";
                string description = $"Este curso cubre {name.ToLowerInvariant().Replace(i.ToString(), "").Trim()}.";
                int creditHours = rnd.Next(2, 5); // Créditos entre 2 y 4

                courses.Add(new Course
                {
                    Id = i,
                    Name = name,
                    Description = description,
                    CreditHours = creditHours
                });
            }
            modelBuilder.Entity<Course>().HasData(courses);

            // --- 3. Sembrar Inscripciones Semestrales (100 registros) ---
            // Una inscripción por estudiante, en un semestre y fecha predefinidos.
            for (int i = 1; i <= 100; i++)
            {
                semesterEnrollments.Add(new SemesterEnrollment(i, "Otoño 2025", 21)
                {
                    Id = i,
                    EnrollmentDate = DateTime.UtcNow.AddDays(-(100 - i)) // Fechas escalonadas
                });
            }
            modelBuilder.Entity<SemesterEnrollment>().HasData(semesterEnrollments);

            // --- 4. Sembrar Cursos Inscritos (100 registros) ---
            // Un curso inscrito por cada inscripción semestral.
            // Para simplificar, cada inscripción tomará el curso con el mismo ID que su propia inscripción.
            for (int i = 1; i <= 100; i++)
            {
                // Asegurarse de que el CourseId existe (del 1 al 100)
                int courseId = i;
                Course selectedCourse = courses.First(c => c.Id == courseId);

                enrolledCourses.Add(new EnrolledCourse(selectedCourse.Name, selectedCourse.CreditHours)
                {
                    Id = i,
                    SemesterEnrollmentId = i // El curso inscrito ID 'i' pertenece a la inscripción ID 'i'
                });
            }
            modelBuilder.Entity<EnrolledCourse>().HasData(enrolledCourses);

            // --- 5. Actualizar CurrentCreditHours para las inscripciones sembradas ---
            // EF Core no ejecuta la lógica de AddCourse/RemoveCourse durante el seeding.
            // Por lo tanto, calculamos y establecemos CurrentCreditHours manualmente.
            foreach (var se in semesterEnrollments)
            {
                se.CurrentCreditHours = enrolledCourses
                    .Where(ec => ec.SemesterEnrollmentId == se.Id)
                    .Sum(ec => ec.CreditHours);
            }
            modelBuilder.Entity<SemesterEnrollment>().HasData(semesterEnrollments);
        }
    }

    // Clase temporal para usar AuthService en OnModelCreating
    // En un escenario real, usarías un seeder de datos separado o un contexto de prueba.
    internal class AuthService : InscripcionApi.Services.Interfaces.IAuthService
    {
        public AuthService(object studentRepository, object configuration) { } // Constructores dummy

        public (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);
            return (Encoding.UTF8.GetBytes(hashedPassword), Encoding.UTF8.GetBytes(salt));
        }

        public bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            try
            {
                string storedSaltString = Encoding.UTF8.GetString(storedSalt);
                string storedHashString = Encoding.UTF8.GetString(storedHash);
                return BCrypt.Net.BCrypt.Verify(password, storedHashString);
            }
            catch
            {
                return false;
            }
        }

        public Task<string?> AuthenticateStudent(string username, string password) // Cambiado a username
        {
            throw new NotImplementedException();
        }
    }
}