// Models/NumberEntry.cs
using System.ComponentModel.DataAnnotations;

namespace MiUtilsApi.Models
{
    public class NumberEntry
    {
        [Key]
        public int Id { get; set; }
    
        public int Value { get; set; }
        public string ParityResult { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    }
}
