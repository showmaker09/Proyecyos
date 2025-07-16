import heroRepository from '../repositories/heroRepository.js'
import villainService from './villainService.js'
import Hero from '../models/heroModel.js'
import villainRepository from '../repositories/villainRepository.js' // Asegúrate de importar el repositorio de villanos
//import heroRepository from '../repositories/heroRepository.js'//veriicar si esto es el problema

async function getAllHeroes() {
    return await heroRepository.getHeroes()
}

async function getHeroById(id) {
    const hero = await heroRepository.getHeroById(id);
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return hero;
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


//NUEVAS VARIABLES PARA LA BATALLA REVISARLO ES NUEVO
 // services/heroService.js


// ... (tus funciones existentes como getAllHeroes, addHero, updateHero, deleteHero, findHeroesByCity, faceVillain) ...

// --- DATOS FIJOS PARA LA SIMULACIÓN DE BATALLA ---
//const BASE_HEALTH = 100;
const BASE_DAMAGE = 15;
//const CRITICAL_CHANCE = 0.2; // 20% de probabilidad de golpe crítico
// const CRITICAL_MULTIPLIER = 1.5; // El daño crítico es 1.5 veces el daño normal
const BASE_HEALTH = 100; // Define una constante para la salud base
// services/heroService.js

// ... (tus imports, BASE_HEALTH, BASE_DAMAGE, calculateDamage, y teamBattle) ...

// INICIO DE CAMBIO: Modificación de la función faceVillain !MODIFIQUE !AQUI! 2:33pm
async function faceVillain(heroId, villainId) {
    console.log(`Iniciando faceVillain: Héroe ID ${heroId} vs Villano ID ${villainId}`);

    // COMENTARIO: Antes se obtenían todos los héroes y se buscaba en memoria.
    // Ahora, se obtiene directamente el héroe por su _id usando el repositorio.
    const hero = await heroRepository.getHeroById(heroId); // <--- CAMBIO CLAVE: Usar getHeroById

    if (!hero) {
        throw new Error(`Héroe con ID ${heroId} no encontrado.`);
    }

    // COMENTARIO: Obtener el villano por su _id usando el servicio de villanos.
    const villain = await villainService.getVillainById(villainId);

    if (!villain) {
        throw new Error(`Villano con ID ${villainId} no encontrado.`);
    }

    console.log(`Héroe: ${hero.alias} (Power: ${hero.power || 50}, Health: ${hero.health || BASE_HEALTH})`);
    console.log(`Villano: ${villain.alias} (Power: ${villain.power || 45}, Health: ${villain.health || BASE_HEALTH})`);

    // COMENTARIO: Usar las propiedades 'power' y 'health' (o 'life') de los modelos
    const heroPower = hero.power || 50; // Usar hero.power
    const villainPower = villain.power || 45; // Usar villain.power

    // COMENTARIO: No estás simulando una batalla por turnos aquí, solo una comparación de poder.
    // Si quieres una batalla por turnos, sería más compleja y similar a teamBattle.
    // Para esta función, mantendremos la lógica de comparación simple.
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

    const battleResult = {
        // COMENTARIO: Usar hero._id y villain._id para la respuesta
        hero: { id: hero._id, alias: hero.alias, name: hero.name, power: heroPower },
        villain: { id: villain._id, alias: villain.alias, name: villain.name, power: villainPower },
        outcome: outcomeMessage,
        winner: winner,
        timestamp: new Date().toISOString()
    };

    console.log('Resultado de faceVillain:', battleResult);
    return battleResult;
}
// FIN DE CAMBIO: Modificación de la función faceVillain  CAMBIO:2_33pm



// Función auxiliar para simular un ataque
function calculateDamage(attackerPower,damageType) // si se agrega el nuevo campo damageType y se hicieron cambios revisar si falla
{
   
   let damage = BASE_DAMAGE + Math.floor(Math.random() * attackerPower); // Daño base más un valor aleatorio basado en el poder del atacante
   
    switch (damageType) 
    {
        case 'basic':
            // Daño básico: no se aplica multiplicador adicional, usa la fórmula base.
            // Puedes ajustar la fórmula base si quieres que 'basic' sea diferente.
            break;
        case 'power':
            // Ataque de poder: un multiplicador para un golpe más fuerte.
            damage *= 1.5; // Ajusta este valor si quieres que sea más o menos potente
            break;
        case 'critical':
            // Ataque crítico: un multiplicador aún mayor para un golpe devastador.
            damage *= 2.0; // Ajusta este valor si quieres que sea más o menos potente
            break;
        default:
            // COMENTARIO: Manejo para un 'damageType' inesperado.
            // Podrías lanzar un error aquí, o simplemente usar un valor por defecto (como el básico).
            // Para mantener la robustez, usaremos el daño básico en caso de un tipo no válido.
            console.warn(`Tipo de daño desconocido: ${damageType}. Usando daño básico por defecto.`);
            break;
    }

    // Asegura que el daño siempre sea al menos 1
    return Math.max(1, Math.floor(damage));
}



// services/heroService.js

// ... (tus imports y definiciones de BASE_HEALTH, calculateDamage) ...

// INICIO DE CAMBIO PRINCIPAL: Modificación de la función teamBattle
async function teamBattle(heroIds, villainIds, damageType) {
    console.log('Iniciando teamBattle con heroIds:', heroIds, 'villainIds:', villainIds, 'damageType:', damageType);

    // Validar los IDs al principio
    if (heroIds.length !== 3 || villainIds.length !== 3) {
        throw new Error('Debe proporcionar exactamente 3 IDs para héroes y 3 para villanos.');
    }

    // Validar el tipo de daño
    const validDamageTypes = ['basic', 'power', 'critical'];
    if (!damageType || !validDamageTypes.includes(damageType)) {
        throw new Error(`Tipo de daño inválido: '${damageType}'. Los valores permitidos son: ${validDamageTypes.join(', ')}.`);
    }

    // INICIO DE CAMBIO: Recuperación eficiente de héroes y villanos usando findById
    // y manejando errores si no se encuentran
    const fetchedHeroesPromises = heroIds.map(id => heroRepository.getHeroById(id));
    const fetchedVillainsPromises = villainIds.map(id => villainRepository.getVillainById(id)); // Usar villainRepository

    const fetchedHeroes = await Promise.all(fetchedHeroesPromises); // 
    const fetchedVillains = await Promise.all(fetchedVillainsPromises);
    
    const heroesInBattle = [];
    for (const [index, hero] of fetchedHeroes.entries()) 
    {
        if (!hero) 
        {
            throw new Error(`Héroe con ID ${heroIds[index]} no encontrado.`);
        }
        heroesInBattle.push(
        {
            _id: hero._id, // Usar _id de MongoDB
            alias: hero.alias,
            name: hero.name,
            power: hero.power || 50, // Usar 'power' consistente con el modelo
            health: hero.health || BASE_HEALTH, // Usar 'health' consistente con el modelo
            initialHealth: hero.health || BASE_HEALTH,
            remainingHealth: hero.health || BASE_HEALTH,
            attackType: damageType
        });
    }

    const villainsInBattle = [];
    for (const [index, villain] of fetchedVillains.entries()) {
        if (!villain) {
            throw new Error(`Villano con ID ${villainIds[index]} no encontrado.`);
        }
        villainsInBattle.push({
            _id: villain._id, // Usar _id de MongoDB
            alias: villain.alias,
            name: villain.name,
            power: villain.power || 45, // Usar 'power' consistente con el modelo
            health: villain.health || BASE_HEALTH, // Usar 'health' consistente con el modelo
            initialHealth: villain.health || BASE_HEALTH,
            remainingHealth: villain.health || BASE_HEALTH,
            attackType: 'basic' // Villanos pueden tener su propia lógica de ataque si es diferente
        });
    }
    // FIN DE CAMBIO: Recuperación eficiente de héroes y villanos

    console.log('Héroes para la batalla:', heroesInBattle.map(h => `${h.alias} (ID: ${h._id})`));
    console.log('Villanos para la batalla:', villainsInBattle.map(v => `${v.alias} (ID: ${v._id})`));


    let round = 0;
    const battleLog = [];
    let winner = null;

    // Bucle principal de la batalla por rondas
    while (heroesInBattle.some(h => h.remainingHealth > 0) && villainsInBattle.some(v => v.remainingHealth > 0) && round < 20) {
        round++;
        battleLog.push(`--- RONDA ${round} ---`);

        // Héroes atacan a Villanos
        for (const hero of heroesInBattle) {
            if (hero.remainingHealth <= 0) continue; // Si el héroe está KO, no ataca

            const livingVillains = villainsInBattle.filter(v => v.remainingHealth > 0);
            if (livingVillains.length === 0) break; // Todos los villanos KO
            const targetVillain = livingVillains[Math.floor(Math.random() * livingVillains.length)];

            // INICIO DE CAMBIO: Usar la nueva calculateDamage y pasar el damageType recibido
            const damageDealt = calculateDamage(hero.power, hero.attackType); // <-- Usar hero.attackType que ya tiene damageType
            // FIN DE CAMBIO
            targetVillain.remainingHealth -= damageDealt;

            let attackDescription = '';
            if (hero.attackType === 'basic') attackDescription = '(Ataque Básico)';
            else if (hero.attackType === 'power') attackDescription = '(Ataque de Poder)';
            else if (hero.attackType === 'critical') attackDescription = '(¡Ataque CRÍTICO!)';

            battleLog.push(`${hero.alias} ataca a ${targetVillain.alias} por ${damageDealt.toFixed(2)} de daño ${attackDescription}. ${targetVillain.alias} tiene ${Math.max(0, targetVillain.remainingHealth).toFixed(2)} de vida restante.`);
        }

        // Verificar si los héroes ganaron después de su ataque
        if (villainsInBattle.every(v => v.remainingHealth <= 0)) {
            winner = "Equipo de Héroes";
            break;
        }

        // Villanos atacan a Héroes
        for (const villain of villainsInBattle) {
            if (villain.remainingHealth <= 0) continue; // Si el villano está KO, no ataca

            const livingHeroes = heroesInBattle.filter(h => h.remainingHealth > 0);
            if (livingHeroes.length === 0) break; // Todos los héroes KO
            const targetHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];

            // INICIO DE CAMBIO: Usar calculateDamage para villanos
            // COMENTARIO: Si los villanos SIEMPRE hacen 'basic' daño, puedes usar 'basic' aquí,
            // o puedes permitir que tengan su propio `attackType` en el futuro.
            const damageDealt = calculateDamage(villain.power, villain.attackType); // <-- Usar villain.attackType
            // FIN DE CAMBIO

            targetHero.remainingHealth -= damageDealt;

            let attackDescription = '';
            if (villain.attackType === 'basic') attackDescription = '(Ataque Básico)';

            battleLog.push(`${villain.alias} ataca a ${targetHero.alias} por ${damageDealt.toFixed(2)} de daño ${attackDescription}. ${targetHero.alias} tiene ${Math.max(0, targetHero.remainingHealth).toFixed(2)} de vida restante.`);
        }

        // Verificar si los villanos ganaron después de su ataque
        if (heroesInBattle.every(h => h.remainingHealth <= 0)) {
            winner = "Equipo de Villanos";
            break;
        }
    }

    // Determinar el ganador final si la batalla termina por límite de rondas
    if (!winner) {
        const totalHeroHealth = heroesInBattle.reduce((sum, h) => sum + Math.max(0, h.remainingHealth), 0);
        const totalVillainHealth = villainsInBattle.reduce((sum, v) => sum + Math.max(0, v.remainingHealth), 0);

        if (totalHeroHealth > totalVillainHealth) {
            winner = "Equipo de Héroes (por vida restante)";
        } else if (totalVillainHealth > totalHeroHealth) {
            winner = "Equipo de Villanos (por vida restante)";
        } else {
            winner = "Empate (límite de rondas alcanzado)";
        }
        battleLog.push(`--- LÍMITE DE RONDAS ALCANZADO ---`);
    }

    const finalMessage = winner.includes("Equipo de Héroes") ? "¡El equipo de Héroes ha ganado la batalla!" :
                         winner.includes("Equipo de Villanos") ? "¡El equipo de Villanos ha prevalecido!" :
                         "La batalla ha terminado en empate.";

    return {
        message: finalMessage,
        battleDetails: {
            heroes: heroesInBattle.map(h => (
                {
                    id: h._id, // Usar _id para la respuesta
                    alias: h.alias,
                    name: h.name,
                    power: h.power,
                    initialHealth: h.initialHealth,
                    remainingHealth: Math.max(0, h.remainingHealth),
                    attackTypeChosen: h.attackType // Mostrar el tipo de ataque que se utilizó
                }
            )),
            villains: villainsInBattle.map(v => (
                {
                    id: v._id, // Usar _id para la respuesta
                    alias: v.alias,
                    name: v.name,
                    power: v.power,
                    initialHealth: v.initialHealth,
                    remainingHealth: Math.max(0, v.remainingHealth),
                    attackTypeChosen: v.attackType // Mostrar el tipo de ataque que se utilizó
                }
            )),
            winner: winner,
            loser: (winner.includes("Héroes") && !winner.includes("Empate")) ? "Equipo de Villanos" :
                   (winner.includes("Villanos") && !winner.includes("Empate")) ? "Equipo de Héroes" : "Ninguno",
            roundsFought: round,
            log: battleLog
        }
    };
}
// FIN DE CAMBIO PRINCIPAL: Función teamBattle

// ... (asegúrate de que todas tus funciones como getAllHeroes, addHero, etc., estén definidas o importadas antes del export default)
// Si estas funciones ya están definidas en este archivo, este `export default` está bien.
export default {
    teamBattle,
     getAllHeroes,
     addHero,
     updateHero,
     deleteHero,
     findHeroesByCity,
     faceVillain,
     getHeroById,
     calculateDamage // Si calculateDamage no se exporta globalmente, puedes exportarlo aquí
};
