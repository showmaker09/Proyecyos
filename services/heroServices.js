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
    if (!hero) 
    {
        throw new Error('Héroe no encontrado');
    }
    return hero;
}

async function addHero(hero) {
    if (!hero.name || !hero.alias)
   {
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

// INICIO DE MODIFICACIÓN: Función teamBattle para Batalla Interactiva 3v3
// Ahora acepta el lado del jugador, sus IDs, su tipo de ataque y los IDs del oponente.
async function teamBattle(playerSide, playerTeamIds, playerAttackType, opponentTeamIds) {
    console.log(`[Service] Iniciando teamBattle Interactiva: Jugador como ${playerSide} con IDs ${playerTeamIds} (${playerAttackType}) vs IDs ${opponentTeamIds}`);

    // --- Validaciones de defensa profunda (redundantes con el router, pero buenas) ---
    if (playerTeamIds.length !== 3 || opponentTeamIds.length !== 3) {
        throw new Error('Debe proporcionar exactamente 3 IDs para el equipo del jugador y 3 para el equipo oponente.');
    }
    const validDamageTypes = ['basic', 'power', 'critical'];
    if (!playerAttackType || !validDamageTypes.includes(playerAttackType)) {
        throw new Error(`Tipo de ataque del jugador inválido: '${playerAttackType}'. Los valores permitidos son: ${validDamageTypes.join(', ')}.`);
    }
    if (!['hero', 'villain'].includes(playerSide)) {
        throw new Error('Lado del jugador inválido. Debe ser "hero" o "villain".');
    }

    // --- INICIO DE CAMBIO CLAVE: Determinación de Equipos y Tipos de Ataque Efectivos ---
    let heroIds;
    let villainIds;
    let heroEffectiveAttackType;    // Tipo de ataque que usarán los héroes en esta batalla
    let villainEffectiveAttackType; // Tipo de ataque que usarán los villanos en esta batalla

    if (playerSide === 'hero') {
        heroIds = playerTeamIds;
        villainIds = opponentTeamIds;
        heroEffectiveAttackType = playerAttackType;
        villainEffectiveAttackType = 'basic'; // El equipo rival (villanos) usa ataque básico por defecto
    } else { // playerSide === 'villain'
        villainIds = playerTeamIds;
        heroIds = opponentTeamIds;
        villainEffectiveAttackType = playerAttackType;
        heroEffectiveAttackType = 'basic'; // El equipo rival (héroes) usa ataque básico por defecto
    }
    // --- FIN DE CAMBIO CLAVE: Determinación de Equipos y Tipos de Ataque Efectivos ---


    // 1. Recuperar Personajes de la base de datos (similar a la lógica anterior de teamBattle)
    try {
        const fetchedHeroesPromises = heroIds.map(id => heroRepository.getHeroById(id));
        // COMENTARIO: Asegúrate de que villainRepository.getVillainById exista y funcione.
        // Si usas un villainService, sería villainService.getVillainById(id)
        const fetchedVillainsPromises = villainIds.map(id => villainRepository.getVillainById(id)); 

        const fetchedHeroes = await Promise.all(fetchedHeroesPromises);
        const fetchedVillains = await Promise.all(fetchedVillainsPromises);

        // Inicializar el estado de batalla para héroes
        const heroesInBattle = [];
        for (const [index, hero] of fetchedHeroes.entries()) {
            if (!hero) {
                throw new Error(`Héroe con ID ${heroIds[index]} no encontrado.`);
            }
            heroesInBattle.push({
                _id: hero._id,
                alias: hero.alias,
                name: hero.name,
                power: hero.power || 50, // Usar power del modelo o 50 por defecto
                health: hero.health || BASE_HEALTH, // Usar health del modelo o BASE_HEALTH por defecto
                initialHealth: hero.health || BASE_HEALTH,
                remainingHealth: hero.health || BASE_HEALTH,
                side: 'hero', // Identificador de bando
                attackType: heroEffectiveAttackType // ASIGNACIÓN DEL TIPO DE ATAQUE EFECTIVO PARA HÉROES
            });
        }

        // Inicializar el estado de batalla para villanos
        const villainsInBattle = [];
        for (const [index, villain] of fetchedVillains.entries()) {
            if (!villain) {
                throw new Error(`Villano con ID ${villainIds[index]} no encontrado.`);
            }
            villainsInBattle.push({
                _id: villain._id,
                alias: villain.alias,
                name: villain.name,
                power: villain.power || 45, // Usar power del modelo o 45 por defecto
                health: villain.health || BASE_HEALTH, // Usar health del modelo o BASE_HEALTH por defecto
                initialHealth: villain.health || BASE_HEALTH,
                remainingHealth: villain.health || BASE_HEALTH,
                side: 'villain', // Identificador de bando
                attackType: villainEffectiveAttackType // ASIGNACIÓN DEL TIPO DE ATAQUE EFECTIVO PARA VILLANOS
            });
        }
        
        console.log('[Service] Héroes en batalla:', heroesInBattle.map(h => `${h.alias} (ID: ${h._id}, Tipo de ataque: ${h.attackType})`));
        console.log('[Service] Villanos en batalla:', villainsInBattle.map(v => `${v.alias} (ID: ${v._id}, Tipo de ataque: ${v.attackType})`));


        // 2. Simulación de la Batalla por Rondas (la lógica principal permanece similar)
        let round = 0;
        const battleLog = [];
        let winner = null;
        const maxRounds = 100; // Límite para evitar bucles infinitos

        console.log('[Service] Iniciando simulación de batalla 3v3...');
        while (
            heroesInBattle.some(h => h.remainingHealth > 0) && // Hay héroes vivos
            villainsInBattle.some(v => v.remainingHealth > 0) && // Hay villanos vivos
            round < maxRounds // No se ha alcanzado el límite de rondas
        ) {
            round++;
            battleLog.push(`--- RONDA ${round} ---`);

            // Héroes atacan a Villanos
            for (const hero of heroesInBattle) {
                if (hero.remainingHealth <= 0) continue; // Si el héroe está KO, no ataca

                const livingVillains = villainsInBattle.filter(v => v.remainingHealth > 0);
                if (livingVillains.length === 0) break; // Todos los villanos KO
                const targetVillain = livingVillains[Math.floor(Math.random() * livingVillains.length)];

                // El daño se calcula con el attackType asignado al héroe
                const damageDealt = calculateDamage(hero.power, hero.attackType); 
                targetVillain.remainingHealth -= damageDealt;

                let attackDescription = '';
                if (hero.attackType === 'basic') attackDescription = '(Ataque Básico)';
                else if (hero.attackType === 'power') attackDescription = '(Ataque de Poder)';
                else if (hero.attackType === 'critical') attackDescription = '(¡Ataque CRÍTICO!)';

                battleLog.push(`${hero.alias} (${hero.side}) ataca a ${targetVillain.alias} (${targetVillain.side}) por ${damageDealt.toFixed(2)} de daño ${attackDescription}. ${targetVillain.alias} tiene ${Math.max(0, targetVillain.remainingHealth).toFixed(2)} de salud restante.`);
            }

            // Verificar si los héroes ganaron después de su ataque
            if (villainsInBattle.every(v => v.remainingHealth <= 0)) {
                winner = "Equipo de Héroes";
                break; // Héroes ganaron, terminar la batalla
            }

            // Villanos atacan a Héroes
            for (const villain of villainsInBattle) {
                if (villain.remainingHealth <= 0) continue; // Si el villano está KO, no ataca

                const livingHeroes = heroesInBattle.filter(h => h.remainingHealth > 0);
                if (livingHeroes.length === 0) break; // Todos los héroes KO
                const targetHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];

                // El daño se calcula con el attackType asignado al villano
                const damageDealt = calculateDamage(villain.power, villain.attackType); 
                targetHero.remainingHealth -= damageDealt;

                let attackDescription = '';
                if (villain.attackType === 'basic') attackDescription = '(Ataque Básico)';
                else if (villain.attackType === 'power') attackDescription = '(Ataque de Poder)';
                else if (villain.attackType === 'critical') attackDescription = '(¡Ataque CRÍTICO!)';

                battleLog.push(`${villain.alias} (${villain.side}) ataca a ${targetHero.alias} (${targetHero.side}) por ${damageDealt.toFixed(2)} de daño ${attackDescription}. ${targetHero.alias} tiene ${Math.max(0, targetHero.remainingHealth).toFixed(2)} de salud restante.`);
            }

            // Verificar si los villanos ganaron después de su ataque
            if (heroesInBattle.every(h => h.remainingHealth <= 0)) {
                winner = "Equipo de Villanos";
                break; // Villanos ganaron, terminar la batalla
            }
        }
        console.log('[Service] Simulación de batalla terminada.');

        // 3. Determinar el ganador final si la batalla terminó por límite de rondas
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

        // --- INICIO DE CAMBIO: Formato de la Respuesta ---
        const finalMessage = winner.includes("Héroes") ? "¡El equipo de Héroes ha ganado la batalla!" :
                             winner.includes("Villanos") ? "¡El equipo de Villanos ha prevalecido!" :
                             "La batalla ha terminado en empate.";

        return {
            message: finalMessage,
            battleDetails: {
                heroes: heroesInBattle.map(h => (
                    {
                        id: h._id,
                        alias: h.alias,
                        name: h.name,
                        power: h.power,
                        initialHealth: h.initialHealth,
                        remainingHealth: Math.max(0, h.remainingHealth),
                        attackTypeUsed: h.attackType // Mostrar el tipo de ataque que se utilizó
                    }
                )),
                villains: villainsInBattle.map(v => (
                    {
                        id: v._id,
                        alias: v.alias,
                        name: v.name,
                        power: v.power,
                        initialHealth: v.initialHealth,
                        remainingHealth: Math.max(0, v.remainingHealth),
                        attackTypeUsed: v.attackType // Mostrar el tipo de ataque que se utilizó
                    }
                )),
                winner: winner,
                // Puedes añadir 'loser' si lo deseas, similar a tu código anterior
                // loser: (winner.includes("Héroes") && !winner.includes("Empate")) ? "Equipo de Villanos" : (winner.includes("Villanos") && !winner.includes("Empate")) ? "Equipo de Héroes" : "Ninguno",
                roundsFought: round,
                log: battleLog,
                playerSide: playerSide, // NUEVO: Lado que el jugador eligió
                playerAttackType: playerAttackType // NUEVO: Tipo de ataque que el jugador eligió
            }
        };
        // --- FIN DE CAMBIO: Formato de la Respuesta ---

    } catch (error) {
        console.error('[Service] Error en teamBattle:', error.message);
        throw error; // Propagar el error para que el router lo capture
    }
}
// FIN DE MODIFICACIÓN: Función teamBattle para Batalla Interactiva 3v3
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
