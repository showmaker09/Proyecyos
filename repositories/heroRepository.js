//import fs from 'fs-extra' //      ATENCION !! solo funciona con archivos JSON
import Hero from '../models/heroModel.js' // Importa el modelo Hero que contiene la base de datos de héroes
import mongoose from 'mongoose' // Importa mongoose para manejar la base de datos MongoDB
//const filePath = './data/superheroes.json' // Verificar la ruta que tu configuraste en tu proyecto.
// INICIO DE CAMBIO: getHeroes
async function getHeroes() 
{
    try {
        // En lugar de leer un JSON, Mongoose.find({}) obtiene todos los documentos de la colección 'heroes'.
        const heroes = await Hero.find({}); // Hero es tu modelo Mongoose.
        // COMENTARIO: Ya no necesitas mapear a 'new Hero()' porque Mongoose te devuelve instancias de tus modelos.
        return heroes;
    } 
    catch (error) {
        console.error("Error al obtener héroes de MongoDB:", error); // Mensaje de error más específico
        throw new Error('Error al obtener héroes.'); // Lanza un error para ser manejado por el servicio/controlador
    }
}


async function getHeroById(id) // !!ATENCION!! este método es para obtener un héroe por su ID de MongoDB
{
    try 
    {
        // COMENTARIO: Es buena práctica validar si el ID es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID de héroe inválido.');
        }
        // Mongoose.findById(id) busca un documento por su ID primario (_id).
        const hero = await Hero.findById(id);
        if (!hero) 
        {
            throw new Error('Héroe no encontrado');
        }
        return hero;
    } 
    catch (error) 
    {
        // Si el error ya es un 'Héroe no encontrado', lo relanzamos para el controlador.
        if (error.message === 'Héroe no encontrado' || error.message === 'ID de héroe inválido.') {
            throw error;
        }
        console.error("Error al obtener héroe por ID de MongoDB:", error);
        throw new Error('Error al obtener el héroe.');
    }
} // Fin de getHeroById




export default 
{
    getHeroes,
    getHeroById,
    
}