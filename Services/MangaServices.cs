using MiMangaBot.Domain;
using MiMangaBot.Domain.Filters;
using MiMangaBot.Infrastructure;
using System.Collections.Generic;
using System.Linq;

namespace MiMangaBot.Services;

public class MangaServices
{
    private readonly MangaRepository _mangaRepository;

    public MangaServices(MangaRepository mangaRepository)
    {
        _mangaRepository = mangaRepository;
    }

    public List<Manga> GetAllMangas()
    {
        return _mangaRepository.GetAllMangas().ToList();
    }

    public Manga? GetMangaById(int id)
    {
        return _mangaRepository.GetMangaById(id);
    }

    public void AddManga(Manga manga)
    {
        _mangaRepository.AddManga(manga);
    }

    public void UpdateManga(int id, Manga updatedManga)
    {
        _mangaRepository.UpdateManga(id, updatedManga);
    }

    public void DeleteManga(int id)
    {
        _mangaRepository.DeleteManga(id);
    }

    public List<Manga> SearchMangas(MangaFilter filter)
    {
        return _mangaRepository.SearchMangas(filter).ToList();
    }
}