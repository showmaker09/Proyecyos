import express from "express";
import { check, validationResult } from 'express-validator';
import villainService from "../services/villainService.js";
import Villain from "../models/heroModel.js";

const router = express.Router();

router.get("/villains", async (req, res) => {
    try {
        const villains = await villainService.getAllVillains();
        res.json(villains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/villains",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array()})
        }

        try {
            const { name, alias, city, team } = req.body;
            const newVillain = new Villain(null, name, alias, city, team);
            const addedVillain = await villainService.addVillain(newVillain);

            res.status(201).json(addedVillain);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

router.put("/villains/:id", async (req, res) => {
    try {
        const updatedVillain = await villainService.updateVillain(req.params.id, req.body);
        res.json(updatedVillain);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/villains/:id', async (req, res) => {
    try {
        const result = await villainService.deleteVillain(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
router.get('/villains/city/:city', async (req, res) => {
  try {
    const villains = await villainService.findVillainsByCity(req.params.city);
    res.json(villains);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router