// Models/User.cs
using System.ComponentModel.DataAnnotations;

namespace MiUtilsApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // Contraseña hasheada

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = string.Empty; // "Admin", "User", etc.
    }
}
