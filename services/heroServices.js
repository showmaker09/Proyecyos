import heroRepository from '../repositories/heroRepository.js'
import villainService from './villainService.js'
import Hero from '../models/heroModel.js'
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
async function faceVillain(heroId, villainId) {
  const heroes = await heroRepository.getHeroes();
  const hero = heroes.find(hero => hero.id === parseInt(heroId));
  if (!hero) {
    throw new Error('Héroe no encontrado');
  }
 // return `${hero.alias} enfrenta a ${villain}`;
const villain = await villainService.getVillainById(villainId); // CAMBIO CLAVE AQUÍ: Obtener el villano por ID

    if (!villain) {
       throw new Error(`Villano '${villainId}' no encontrado.`);

    }
     const heroPower = hero.powerLevel || 50; // Valor por defecto si no tienen powerLevel
    const villainPower = villain.powerLevel || 45; // Valor por defectomue
    const herolife = hero.life || 100; // Valor por defecto si no tienen life
    const villainlife = villain.life || 90; // Valor por defecto si no tienen life

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
        hero: { id: hero.id, alias: hero.alias, name: hero.name, power: heroPower },
        villain: { id: villain.id, alias: villain.alias, name: villain.name, power: villainPower },
        outcome: outcomeMessage,
        winner: winner,
        timestamp: new Date().toISOString()
    };

    return battleResult;

  }

//NUEVAS VARIABLES PARA LA BATALLA REVISARLO ES NUEVO
 // services/heroService.js


// ... (tus funciones existentes como getAllHeroes, addHero, updateHero, deleteHero, findHeroesByCity, faceVillain) ...

// --- DATOS FIJOS PARA LA SIMULACIÓN DE BATALLA ---
const BASE_HEALTH = 100;
const BASE_DAMAGE = 15;
const CRITICAL_CHANCE = 0.2; // 20% de probabilidad de golpe crítico
const CRITICAL_MULTIPLIER = 1.5; // El daño crítico es 1.5 veces el daño normal

// Función auxiliar para simular un ataque
function calculateDamage(attackerPower, defenderHealth, isCritical) {
    let damage = BASE_DAMAGE + (attackerPower / 10); // Daño base + bonificación por poder
    if (isCritical) {
        damage *= CRITICAL_MULTIPLIER;
    }
    return Math.floor(damage); // Redondea hacia abajo el daño
}

async function teamBattle(heroIds, villainIds) {
    if (heroIds.length !== 3 || villainIds.length !== 3) {
        throw new Error('Debe proporcionar exactamente 3 IDs para héroes y 3 para villanos.');
    }

    // 1. Obtener los héroes y villanos del repositorio
    const allHeroes = await heroRepository.getHeroes();
    const allVillains = await villainService.getAllVillains(); // Usamos getAllVillains para obtener la lista completa

    const heroesInBattle = heroIds.map(id => {
        const hero = allHeroes.find(h => h.id === parseInt(id));
        if (!hero) throw new Error(`Héroe con ID ${id} no encontrado.`);
        return {
            ...hero,
            initialHealth: BASE_HEALTH,
            remainingHealth: BASE_HEALTH,
            criticalDamageChance: `${CRITICAL_CHANCE * 100}%` // Para mostrar en el resultado
        };
    });

    const villainsInBattle = villainIds.map(id => {
        const villain = allVillains.find(v => v.id === parseInt(id));
        if (!villain) throw new Error(`Villano con ID ${id} no encontrado.`);
        return {
            ...villain,
            initialHealth: BASE_HEALTH,
            remainingHealth: BASE_HEALTH,
            criticalDamageChance: `${CRITICAL_CHANCE * 100}%` // Para mostrar en el resultado
        };
    });

    // Validar que se encontraron todos
    if (heroesInBattle.length !== 3) {
        throw new Error('No se encontraron todos los héroes con los IDs proporcionados.');
    }
    if (villainsInBattle.length !== 3) {
        throw new Error('No se encontraron todos los villanos con los IDs proporcionados.');
    }

    let round = 0;
    const battleLog = [];
    let winner = null;

    // Bucle principal de la batalla por rondas
    while (heroesInBattle.some(h => h.remainingHealth > 0) && villainsInBattle.some(v => v.remainingHealth > 0) && round < 20) { // Límite de rondas para evitar bucles infinitos
        round++;
        battleLog.push(`--- RONDA ${round} ---`);

        // Héroes atacan a Villanos
        for (const hero of heroesInBattle) {
            if (hero.remainingHealth <= 0) continue; // Si el héroe está KO, no ataca

            // Elegir un villano aleatorio y que esté vivo para atacar
            const livingVillains = villainsInBattle.filter(v => v.remainingHealth > 0);
            if (livingVillains.length === 0) break; // Todos los villanos KO
            const targetVillain = livingVillains[Math.floor(Math.random() * livingVillains.length)];

            const isCritical = Math.random() < CRITICAL_CHANCE;
            const damageDealt = calculateDamage(hero.powerLevel || 50, targetVillain.remainingHealth, isCritical); // Usa powerLevel o un valor por defecto
            targetVillain.remainingHealth -= damageDealt;

            const critMessage = isCritical ? ' (¡CRÍTICO!)' : '';
            battleLog.push(`${hero.alias} ataca a ${targetVillain.alias || targetVillain.name} por ${damageDealt} de daño${critMessage}. ${targetVillain.alias || targetVillain.name} tiene ${Math.max(0, targetVillain.remainingHealth)} de vida restante.`);
        }

        // Verificar si los héroes ganaron después de su ataque
        if (villainsInBattle.every(v => v.remainingHealth <= 0)) {
            winner = "Equipo de Héroes";
            break;
        }

        // Villanos atacan a Héroes
        for (const villain of villainsInBattle) {
            if (villain.remainingHealth <= 0) continue; // Si el villano está KO, no ataca

            // Elegir un héroe aleatorio y que esté vivo para atacar
            const livingHeroes = heroesInBattle.filter(h => h.remainingHealth > 0);
            if (livingHeroes.length === 0) break; // Todos los héroes KO
            const targetHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];

            const isCritical = Math.random() < CRITICAL_CHANCE;
            const damageDealt = calculateDamage(villain.powerLevel || 45, targetHero.remainingHealth, isCritical); // Usa powerLevel o un valor por defecto
            targetHero.remainingHealth -= damageDealt;

            const critMessage = isCritical ? ' (¡CRÍTICO!)' : '';
            battleLog.push(`${villain.alias || villain.name} ataca a ${targetHero.alias} por ${damageDealt} de daño${critMessage}. ${targetHero.alias} tiene ${Math.max(0, targetHero.remainingHealth)} de vida restante.`);
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
            heroes: heroesInBattle.map(h => ({
                id: h.id,
                alias: h.alias,
                name: h.name,
                power: h.powerLevel || 50,
                initialHealth: h.initialHealth,
                remainingHealth: Math.max(0, h.remainingHealth), // Asegura que no sea negativo
                criticalDamageChance: h.criticalDamageChance
            })),
            villains: villainsInBattle.map(v => ({
                id: v.id,
                alias: v.alias,
                name: v.name,
                power: v.powerLevel || 45,
                initialHealth: v.initialHealth,
                remainingHealth: Math.max(0, v.remainingHealth), // Asegura que no sea negativo
                criticalDamageChance: v.criticalDamageChance
            })),
            winner: winner,
            loser: (winner.includes("Héroes") && !winner.includes("Empate")) ? "Equipo de Villanos" :
                   (winner.includes("Villanos") && !winner.includes("Empate")) ? "Equipo de Héroes" : "Ninguno",
            roundsFought: round,
            log: battleLog
        }
    };
}




export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    getHeroById,
    teamBattle,
    calculateDamage

}