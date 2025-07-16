import express from "express";
import { check,body, validationResult } from 'express-validator';
import heroService from "../services/heroServices.js";
import Hero from "../models/heroModel.js";
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


// nuevo router verificar si esto falla::
router.post(
  '/heroes/team-battle',
  [
    body('heroIds')
      .isArray({ min: 3, max: 3 })
      .withMessage('Debe proporcionar exactamente 3 IDs para héroes.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && id > 0))
      .withMessage('Los IDs de héroes deben ser números enteros positivos.'),
    body('villainIds')
      .isArray({ min: 3, max: 3 })
      .withMessage('Debe proporcionar exactamente 3 IDs para villanos.')
      .bail()
      .custom(value => value.every(id => typeof id === 'number' && id > 0))
      .withMessage('Los IDs de villanos deben ser números enteros positivos.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { heroIds, villainIds } = req.body;
      const battleResult = await heroService.teamBattle(heroIds, villainIds);
      res.json(battleResult);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message.includes('No se encontraron todos los')) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes('debe proporcionar exactamente')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
);




export default router