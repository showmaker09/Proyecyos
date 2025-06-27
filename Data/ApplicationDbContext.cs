// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using MiUtilsApi.Models;
using BCrypt.Net;

namespace MiUtilsApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public ApplicationDbContext(string connectionString) : base(GetOptions(connectionString))
        {
        }

        private static DbContextOptions<ApplicationDbContext> GetOptions(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 32))); // Mantener 8.0.32 de MySQL
            return optionsBuilder.Options;
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<PalindromeEntry> Palindromes { get; set; }
        public DbSet<NumberEntry> Numbers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("adminpassword"),
                    Role = "Admin"
                }
            );

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(20);

            modelBuilder.Entity<Item>()
                .Property(i => i.Name)
                .HasMaxLength(255);

            modelBuilder.Entity<PalindromeEntry>()
                .Property(p => p.OriginalText)
                .IsRequired()
                .HasMaxLength(255);

            modelBuilder.Entity<NumberEntry>()
                .Property(n => n.ParityResult)
                .IsRequired()
                .HasMaxLength(10);
        }
    }
}
