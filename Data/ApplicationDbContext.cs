using InscripcionApi.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace InscripcionApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Constructor para usos fuera de DI (ej. tests o migraciones manuales)
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
        public DbSet<Course> Courses { get; set; } // Si incluyes el modelo Course

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de relaciones
            modelBuilder.Entity<SemesterEnrollment>()
                .HasOne(se => se.Student)
                .WithMany(s => s.SemesterEnrollments)
                .HasForeignKey(se => se.StudentId)
                .OnDelete(DeleteBehavior.Cascade); // Si borras un estudiante, sus inscripciones también

            modelBuilder.Entity<EnrolledCourse>()
                .HasOne(ec => ec.SemesterEnrollment)
                .WithMany(se => se.EnrolledCourses)
                .HasForeignKey(ec => ec.SemesterEnrollmentId)
                .OnDelete(DeleteBehavior.Cascade); // Si borras una inscripción, sus cursos inscritos también

            // Sembrado de datos para el usuario Estudiante por defecto
            // Contraseña: estudiantepassword
            string password = "estudiantepassword";
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt());

            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1, // ID fijo para el usuario de sembrado
                    FirstName = "Estudiante",
                    LastName = "Demo",
                    Email = "estudiante@universidad.com",
                    PasswordHash = System.Text.Encoding.UTF8.GetBytes(passwordHash),
                    PasswordSalt = System.Text.Encoding.UTF8.GetBytes(BCrypt.Net.BCrypt.GenerateSalt()), // Puedes generar un salt real aquí o reutilizar el del hash
                    Role = "Estudiante"
                }
            );

            // Opcional: Sembrar algunos cursos base
            modelBuilder.Entity<Course>().HasData(
                new Course { Id = 1, Name = "Programación Orientada a Objetos", CreditHours = 4 },
                new Course { Id = 2, Name = "Bases de Datos Relacionales", CreditHours = 3 },
                new Course { Id = 3, Name = "Cálculo Diferencial", CreditHours = 5 },
                new Course { Id = 4, Name = "Redes de Computadoras", CreditHours = 3 }
            );
        }
    }
}