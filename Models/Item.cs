// Models/Item.cs
using System.ComponentModel.DataAnnotations;

namespace MiUtilsApi.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}
// Models/Item.cs
// This class represents an item in the system with a unique identifier and a name.