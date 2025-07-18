import express from "express";
import { param,check,body, validationResult } from 'express-validator'; // Importa param y body de express-validator !!IMPORTANTE NO OLVIDARLO
import heroService from "../services/heroServices.js";
import Hero from "../models/heroModel.js";



const router = express.Router();

router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/heroes/:id", async (req, res) => {
    try {
        const heroes = await heroService.getHeroById(req.params.id);
        res.json(heroes);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/heroes",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.args()})
        }

        try {
            const { name, alias, city, team } = req.body;
            const newHero = new Hero(null, name, alias, city, team);
            const addedHero = await heroService.addHero(newHero);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
router.get('/heroes/city/:city', async (req, res) => {
  try {
    const heroes = await heroService.findHeroesByCity(req.params.city);
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/heroes/:id/enfrentar', async (req, res) => {
  try {
    // CAMBIO CLAVE AQUÍ: Extraer villainId del cuerpo de la solicitud
    const heroId = req.params.id;
    const villainId = req.body.villainId; // <--- Extraer villainId del cuerpo

    // Llama al servicio con el heroId y el villainId
    const result = await heroService.faceVillain(heroId, villainId);

    // Tu servicio ya devuelve el objeto 'battleResult', así que lo envías directamente
    res.json(result);
  } catch (err) {
    // Manejo mejorado de errores para respuestas HTTP más claras.
    if (err.message.includes('Héroe no encontrado') || err.message.includes('Villano no encontrado')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});


  
 router.post(
  '/heroes/interactive-battle/start', // CAMBIO DE RUTA
  [
    body('playerSide')
      .not().isEmpty().withMessage('El lado del jugador es requerido.')
      .bail()
      .isIn(['hero', 'villain']).withMessage('El lado del jugador debe ser "hero" o "villain".'),

    body('playerTeamIds')
      .isArray({ min: 3, max: 3 }).withMessage('Debe proporcionar exactamente 3 IDs para el equipo del jugador.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && Number.isInteger(id) && id > 0))
      .withMessage('Los IDs del equipo del jugador deben ser números enteros positivos.'),

    body('opponentTeamIds')
      .isArray({ min: 3, max: 3 }).withMessage('Debe proporcionar exactamente 3 IDs para el equipo oponente.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && Number.isInteger(id) && id > 0))
      .withMessage('Los IDs del equipo oponente deben ser números enteros positivos.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { playerSide, playerTeamIds, opponentTeamIds } = req.body;
      
      // Llamamos a un nuevo método en heroService para iniciar la batalla
      const battleStartInfo = await heroService.startInteractiveBattle(playerSide, playerTeamIds, opponentTeamIds);
      
      res.json(battleStartInfo); // Devolvemos battleId y initialState
    } catch (err) {
      console.error('Error al iniciar batalla interactiva:', err.message);
      if (err.message.includes('no encontrado') || err.message.includes('inválido') || err.message.includes('duplicado')) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error interno del servidor al iniciar la batalla: ' + err.message });
    }
  }
);
// FIN DE NUEVA IMPLEMENTACIÓN: Ruta POST para INICIAR la Batalla Interactiva por Turnos


// INICIO DE NUEVA IMPLEMENTACIÓN: Ruta POST para PROCESAR UN TURNO en la Batalla Interactiva
router.post(
  '/heroes/interactive-battle/:battleId/turn', // RUTA PARA CADA TURNO
  [
    // Validación del battleId en los parámetros de la URL
    param('battleId') //SE DEBE USAR UN IMPORT COMO 'param' de express-validator
      .not().isEmpty().withMessage('El ID de la batalla es requerido.')
      .bail()
      .isUUID().withMessage('El ID de la batalla debe ser un UUID válido.'), // Asumiendo que battleId es un UUID

    // Validación para el array de acciones del jugador
    body()
      .isArray({ min: 1, max: 3 }).withMessage('Debe proporcionar entre 1 y 3 acciones para el equipo del jugador.')
      .bail()
      .custom(actions => {
        // Cada elemento del array debe ser un objeto PlayerAction
        return actions.every(action => {
          return typeof action === 'object' && action !== null &&
                 typeof action.characterId === 'number' && Number.isInteger(action.characterId) && action.characterId > 0 &&
                 typeof action.attackType === 'string' && ['basic', 'power', 'critical'].includes(action.attackType) &&
                 (action.targetId === undefined || (typeof action.targetId === 'number' && Number.isInteger(action.targetId) && action.targetId > 0)); // targetId es opcional
        });
      }).withMessage('Cada acción debe especificar un characterId (entero positivo), un attackType válido (basic, power, critical) y opcionalmente un targetId (entero positivo).')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { battleId } = req.params; // Obtener battleId de los parámetros de la URL
      const playerActions = req.body; // El cuerpo de la solicitud es el array de PlayerAction

      // Llamamos a un nuevo método en heroService para procesar el turno
      const updatedBattleState = await heroService.processBattleRound(battleId, playerActions);
      
      res.json(updatedBattleState); // Devolvemos el estado actualizado de la batalla
    } catch (err) {
      console.error('Error al procesar el turno de batalla:', err.message);
      if (err.message.includes('Batalla no encontrada')) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes('terminado')) { // Ej. "La batalla ya ha terminado."
        return res.status(409).json({ error: err.message });
      }
      if (err.message.includes('inválido') || err.message.includes('no es parte de')) { // Ej. "Acción inválida"
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error interno del servidor al procesar el turno: ' + err.message });
    }
  }
);
// FIN DE NUEVA IMPLEMENTACIÓN: Ruta POST para PROCESAR UN TURNO en la Batalla Interactiva



export default router;