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

// repositories/heroRepository.js
// ...
async function getHeroById(id) {
    try {
        // COMENTARIO: Mongoose.Types.ObjectId.isValid(id) verifica si el ID es un ObjectId (el tipo por defecto).
        // Si ahora tus IDs son números, esta validación debe cambiar o eliminarse si sabes que siempre serán números.
        // if (!mongoose.Types.ObjectId.isValid(id)) { // Esto ya no es necesario si tus _id son números
        //     throw new Error('ID de héroe inválido (no es un ObjectId).');
        // }
        // El findById buscará por el _id, que ahora es tu número
        const hero = await Hero.findById(id); // Esto buscará un documento cuyo _id sea el 'id' numérico
        if (!hero) {
            throw new Error('Héroe no encontrado');
        }
        return hero;
    } catch (error) {
        if (error.message === 'Héroe no encontrado') {
            throw error;
        }
        console.error("Error al obtener héroe por ID de MongoDB:", error);
        throw new Error('Error al obtener el héroe.');
    }
}
// ...



export default 
{
    getHeroes,
    getHeroById,
    
}