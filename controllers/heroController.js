import express from "express";
import { check,body, validationResult } from 'express-validator';
import heroService from "../services/heroServices.js";
import Hero from "../models/heroModel.js";
import { Router } from 'express';


//import{body,validationResult} from 'express-validator';// revisar si esto es necesario

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


  
/**
 * @route POST /api/heroes/team-battle-interactive
 * @description Permite al usuario iniciar una batalla 3v3 interactiva eligiendo su bando y tipo de ataque.
 * @access Public
 * @body {string} playerSide - El bando del jugador ('hero' o 'villain').
 * @body {number[]} playerTeamIds - Array de 3 IDs de los personajes del equipo del jugador.
 * @body {string} playerAttackType - Tipo de ataque para el equipo del jugador ('basic', 'power', 'critical').
 * @body {number[]} opponentTeamIds - Array de 3 IDs de los personajes del equipo oponente.
 */
router.post(
  '/heroes/:team-battle-interactive',
  [
    // Validación para 'playerSide'
    body('playerSide')
      .not().isEmpty().withMessage('El lado del jugador es requerido.')
      .bail() // Si falla, no continuar con validaciones encadenadas
      .isIn(['hero', 'villain']).withMessage('El lado del jugador debe ser "hero" o "villain".'),

    // Validación para 'playerTeamIds'
    body('playerTeamIds')
      .isArray({ min: 3, max: 3 }).withMessage('Debe proporcionar exactamente 3 IDs para el equipo del jugador.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && Number.isInteger(id) && id > 0))
      .withMessage('Los IDs del equipo del jugador deben ser números enteros positivos.'),

    // Validación para 'playerAttackType'
    body('playerAttackType')
      .not().isEmpty().withMessage('El tipo de ataque es requerido.')
      .bail()
      .isIn(['basic', 'power', 'critical']).withMessage('Tipo de ataque inválido. Los valores permitidos son: basic, power, critical.'),
    
    // Validación para 'opponentTeamIds'
    body('opponentTeamIds')
      .isArray({ min: 3, max: 3 }).withMessage('Debe proporcionar exactamente 3 IDs para el equipo oponente.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && Number.isInteger(id) && id > 0))
      .withMessage('Los IDs del equipo oponente deben ser números enteros positivos.'),
  ],
  async (req, res) => {
    // Captura los errores de validación de las reglas definidas arriba
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Extrae los datos validados del cuerpo de la solicitud
      const { playerSide, playerTeamIds, playerAttackType, opponentTeamIds } = req.body;
      
      // Llama a la función de servicio teamBattle (que modificaremos a continuación)
      // con los nuevos parámetros de la batalla interactiva
      const battleResult = await heroService.teamBattle(playerSide, playerTeamIds, playerAttackType, opponentTeamIds);
      
      // Envía la respuesta con el resultado de la batalla
      res.json(battleResult);
    } catch (err) {
      console.error('Error en /team-battle-interactive:', err.message);
      // Manejo de errores específico para IDs no encontrados o inválidos
      if (err.message.includes('no encontrado') || err.message.includes('inválido')) {
        return res.status(404).json({ error: err.message });
      }
      // Para cualquier otro error no manejado específicamente, devolver 500
      res.status(500).json({ error: 'Error interno del servidor al procesar la batalla: ' + err.message });
    }
  }
);
// FIN DE NUEVA IMPLEMENTACIÓN: Ruta POST par



  export default router