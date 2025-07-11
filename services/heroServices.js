import heroRepository from '../repositories/heroRepository.js'
import villainService from './villainService.js'
import Hero from '../models/heroModel.js'





async function getAllHeroes() {
    return await heroRepository.getHeroes()
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();

    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId };

    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);

    return newHero;
}

async function updateHero(id, updatedHero) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    delete updatedHero.id;
    heroes[index] = { ...heroes[index], ...updatedHero };

    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}


async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
  const heroes = await heroRepository.getHeroes();
  return heroes.filter(hero => hero.city.toLowerCase() === city.toLowerCase());
}

// esto es para enfrentar a un villano
async function faceVillain(heroId, villainName) {
  const heroes = await heroRepository.getHeroes();
  const hero = heroes.find(hero => hero.id === parseInt(heroId));
  if (!hero) {
    throw new Error('Héroe no encontrado');
  }
 // return `${hero.alias} enfrenta a ${villain}`;
     const villain = await villainService.getVillainByName(villainName);
    if (!villain) 
    {
       throw new Error(`Villano '${villainName}' no encontrado.`);

    }
     const heroPower = hero.powerLevel || 50; // Valor por defecto si no tienen powerLevel
    const villainPower = villain.powerLevel || 45; // Valor por defectomue

    let outcomeMessage;
    let winner = null;

    if (heroPower > villainPower) {
        outcomeMessage = `${hero.alias} (${hero.name}) derrota a ${villain.alias || villain.name} (${villain.name})! ¡La justicia prevalece!`;
        winner = hero.alias;
    } else if (villainPower > heroPower) {
        outcomeMessage = `${villain.alias || villain.name} (${villain.name}) ha vencido a ${hero.alias} (${hero.name})! ¡El caos se apodera!`;
        winner = villain.alias || villain.name;
    } else {
        outcomeMessage = `${hero.alias} (${hero.name}) y ${villain.alias || villain.name} (${villain.name}) han luchado hasta un empate. ¡La batalla continúa!`;
        winner = "Empate";
    }

 

  }


export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain
}