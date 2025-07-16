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




// INICIO DE CAMBIO: Modificación de la función teamBattle para aceptar 'damageType'
async function teamBattle(heroIds, villainIds, damageType)
{ // Llave de apertura de teamBattle
    if (heroIds.length !== 3 || villainIds.length !== 3)
    {
        throw new Error('Debe proporcionar exactamente 3 IDs para héroes y 3 para villanos.');
    }

    // Validar el tipo de daño
    const validDamageTypes = ['basic', 'power', 'critical'];
    if (!damageType || !validDamageTypes.includes(damageType))
    {
        throw new Error(`Tipo de daño inválido: '${damageType}'. Los valores permitidos son: ${validDamageTypes.join(', ')}.`);
    }

    // 1. Obtener los héroes y villanos del repositorio
    const allHeroes = await heroRepository.getHeroes();
    const allVillains = await villainService.getAllVillains();

    const heroesInBattle = heroIds.map(id => {
        const hero = allHeroes.find(h => h.id === parseInt(id));
        if (!hero) throw new Error(`Héroe con ID ${id} no encontrado.`);
        return {
            ...hero,
            initialHealth: BASE_HEALTH,
            remainingHealth: BASE_HEALTH,
            powerLevel: hero.powerLevel || hero.power || 50,
            attackType: damageType // Esto es un cambio importante
        };
    });

    const villainsInBattle = villainIds.map(id => {
        const villain = allVillains.find(v => v.id === parseInt(id));
        if (!villain) throw new Error(`Villano con ID ${id} no encontrado.`);
        return {
            ...villain,
            initialHealth: BASE_HEALTH,
            remainingHealth: BASE_HEALTH,
            powerLevel: villain.powerLevel || villain.power || 45,
            attackType: damageType // Esto es un cambio importante
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
    while (heroesInBattle.some(h => h.remainingHealth > 0) && villainsInBattle.some(v => v.remainingHealth > 0) && round < 20) {
        round++;
        battleLog.push(`--- RONDA ${round} ---`);

        // Héroes atacan a Villanos
        for (const hero of heroesInBattle) {
            if (hero.remainingHealth <= 0) continue; // Si el héroe está KO, no ataca

            // Elegir un villano aleatorio y que esté vivo para atacar
            const livingVillains = villainsInBattle.filter(v => v.remainingHealth > 0);
            if (livingVillains.length === 0) break; // Todos los villanos KO
            const targetVillain = livingVillains[Math.floor(Math.random() * livingVillains.length)];

            // INICIO DE CAMBIO: Usar la nueva calculateDamage y pasar el damageType
            const damageDealt = calculateDamage(hero.powerLevel, damageType);
            // FIN DE CAMBIO
            targetVillain.remainingHealth -= damageDealt;

            // COMENTARIO: Ajusta el mensaje para reflejar el tipo de ataque en lugar de "crítico aleatorio".
            let attackDescription = '';
            if (damageType === 'basic') attackDescription = '(Ataque Básico)';
            else if (damageType === 'power') attackDescription = '(Ataque de Poder)';
            else if (damageType === 'critical') attackDescription = '(¡Ataque CRÍTICO!)';

            battleLog.push(`${hero.alias} ataca a ${targetVillain.alias || targetVillain.name} por ${damageDealt} de daño ${attackDescription}. ${targetVillain.alias || targetVillain.name} tiene ${Math.max(0, targetVillain.remainingHealth)} de vida restante.`);
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

            // INICIO DE CAMBIO: Usar la nueva calculateDamage y pasar el damageType
            const damageDealt = calculateDamage(villain.powerLevel, damageType); // <-- PASA damageType
            // FIN DE CAMBIO

            targetHero.remainingHealth -= damageDealt;

            // COMENTARIO: Ajusta el mensaje para reflejar el tipo de ataque.
            let attackDescription = '';
            if (damageType === 'basic') attackDescription = '(Ataque Básico)';
            else if (damageType === 'power') attackDescription = '(Ataque de Poder)';
            else if (damageType === 'critical') attackDescription = '(¡Ataque CRÍTICO!)';

            battleLog.push(`${villain.alias || villain.name} ataca a ${targetHero.alias} por ${damageDealt} de daño ${attackDescription}. ${targetHero.alias} tiene ${Math.max(0, targetHero.remainingHealth)} de vida restante.`);
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
        battleDetails: { // Llave de apertura de battleDetails
            heroes: heroesInBattle.map(h => (
                { // Llave de apertura del objeto héroe mapeado
                    id: h.id,
                    alias: h.alias,
                    name: h.name,
                    power: h.powerLevel || 50,
                    initialHealth: h.initialHealth,
                    remainingHealth: Math.max(0, h.remainingHealth),
                    attackTypeChosen: h.attackType // Mostrar el tipo de ataque que se utilizó
                } // Llave de cierre del objeto héroe mapeado
            )),
            villains: villainsInBattle.map(v => (
                { // Llave de apertura del objeto villano mapeado
                    id: v.id,
                    alias: v.alias,
                    name: v.name,
                    power: v.powerLevel || 45,
                    initialHealth: v.initialHealth,
                    remainingHealth: Math.max(0, v.remainingHealth),
                    attackTypeChosen: v.attackType // Mostrar el tipo de ataque que se utilizó
                } // Llave de cierre del objeto villano mapeado
            )),
            winner: winner,
            loser: (winner.includes("Héroes") && !winner.includes("Empate")) ? "Equipo de Villanos" :
                   (winner.includes("Villanos") && !winner.includes("Empate")) ? "Equipo de Héroes" : "Ninguno",
            roundsFought: round,
            log: battleLog
        } // Llave de cierre de battleDetails
    };
} // Llave de cierre de teamBattle


// Asegúrate de que `getAllHeroes`, `addHero`, `updateHero`, `deleteHero`, `findHeroesByCity`, `faceVillain`, `getHeroById`
// estén definidas en este mismo archivo, o importadas de alguna parte.
// Si no están definidas, este `export default` podría causar un error de referencia.
export default {
    // Si estas funciones están definidas en este archivo, deben ser declaradas antes de ser exportadas.
     getAllHeroes,
     addHero,
     updateHero,
     deleteHero,
     findHeroesByCity,
     faceVillain,
     getHeroById,
     teamBattle,
     calculateDamage // También exporta calculateDamage si necesitas que sea accesible fuera de este módulo
}