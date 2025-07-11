import fs from 'fs-extra'
import Villain from '../models/villainModel.js'

const filePath = './data/villains.json' // Verificar la ruta que tu configuraste en tu proyecto.

async function getVillains() {
    try {
        const data = await fs.readJson(filePath)
        return data.map(villain => new Villain(
            villain.id, villain.name, villain.alias, villain.city, villain.team
        ))
    } catch (error) {
        console.error(error)
    }

}

async function saveVillains(villains) {
    try {
        await fs.writeJson(filePath, villains)
    } catch (error) {
        console.error(error)
    }
}

export default {
    getVillains,
    saveVillains
}

      