namespace MiMangaBot.Domain; // ¡Asegúrate de que el namespace sea exactamente este!

public class Usuario
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty; // ¡Mantén este nombre aquí!
    public string Role { get; set; } = "User";
}