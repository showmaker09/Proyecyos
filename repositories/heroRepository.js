import fs from 'fs-extra'
import Hero from '../models/heroModel.js'

const filePath = './data/superheroes.json' // Verificar la ruta que tu configuraste en tu proyecto.

async function getHeroes() {
    try {
        const data = await fs.readJson(filePath)
        return data.map(hero => new Hero(
            hero.id, hero.name, hero.alias, hero.city, hero.team
        ))
    } catch (error) {
        console.error(error)
    }

}
async function getHeroById(id) {
    try {
        const heroes = await getHeroes();
        const hero = heroes.find(h => h.id === parseInt(id));
        if (!hero) {
            throw new Error('Héroe no encontrado');
        }
        return hero;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el héroe');
    }
}

async function saveHeroes(heroes) {
    try {
        await fs.writeJson(filePath, heroes)
    } catch (error) {
        console.error(error)
    }
}

export default {
    getHeroes,
    getHeroById,
    saveHeroes
}