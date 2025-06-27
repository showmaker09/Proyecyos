// Models/PalindromeEntry.cs
using System.ComponentModel.DataAnnotations;

namespace MiUtilsApi.Models
{
    public class PalindromeEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)] // Longitud del texto original
        public string OriginalText { get; set; } = string.Empty;

        public bool IsPalindromeResult { get; set; } // True/False
        public DateTime CreationDate { get; set; } = DateTime.UtcNow; // Fecha de registro
    }
}
