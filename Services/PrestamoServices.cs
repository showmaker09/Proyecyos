using MiMangaBot.Domain;
using MiMangaBot.Infrastructure;
using System.Collections.Generic;
using System.Linq;

namespace MiMangaBot.Services;

public class PrestamoServices
{
    private readonly PrestamoRepository _prestamoRepository;

    public PrestamoServices(PrestamoRepository prestamoRepository)
    {
        _prestamoRepository = prestamoRepository;
    }

    public List<Prestamo> GetAllPrestamos()
    {
        return _prestamoRepository.GetAllPrestamos().ToList();
    }

    public Prestamo? GetPrestamoById(int id)
    {
        return _prestamoRepository.GetPrestamoById(id);
    }

    public void AddPrestamo(Prestamo prestamo)
    {
        _prestamoRepository.AddPrestamo(prestamo);
    }

    public void UpdatePrestamo(int id, Prestamo updatedPrestamo)
    {
        _prestamoRepository.UpdatePrestamo(id, updatedPrestamo);
    }

    public void DeletePrestamo(int id)
    {
        _prestamoRepository.DeletePrestamo(id);
    }
}