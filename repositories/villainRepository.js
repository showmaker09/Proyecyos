import fs from 'fs-extra'
import Villain from '../models/villainModel.js'

// const filePath = './data/villains.json' // Verificar la ruta que tu configuraste en tu proyecto.

async function getVillains() {
    try 
    {
        const villains = await Villain.find({}); // Obtiene todos los villanos de la base de datos
        return villains; // Retorna los villanos obtenidos
    } catch (error) {
        console.error(error)
    }

}

 async function getVillainById(id) 
 {
    try 
    {

        if (!mongoose.Types.ObjectId.isValid(id)) 
        {
            throw new Error('ID de villano inválido.');
        }
        const villain = await Villain.findById(id); // Busca un villano por su ID
        if (!villain) 
        {
            throw new Error('Villano no encontrado');
        }
        return villain;
    } 
    catch (error) 
    {
        if (error.message === 'Villano no encontrado') 
        {
            throw error; // Relanza el error si el villano no se encuentra
        }
        console.error("Error al obtener villano por ID de MongoDB:", error);
        throw new Error('Error al obtener el villano');
    }

 }

export default
 {
    getVillains,
    getVillainById
}

      