// seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Hero from './models/heroModel.js';
import Villain from './models/villainModel.js';

// INICIO DE CAMBIO: Leer archivos JSON usando fs.promises
import { promises as fs } from 'fs'; // Importa el módulo 'fs' con promesas
import path from 'path'; // Para construir rutas de archivos de forma segura
import { fileURLToPath } from 'url'; // Para obtener __dirname en módulos ES

// COMENTARIO: Estas dos líneas son necesarias para obtener el equivalente a __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función auxiliar para leer un archivo JSON
async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo JSON ${filePath}:`, error);
        throw error; // Relanza el error para que el importData lo capture
    }
}
// FIN DE CAMBIO: Leer archivos JSON usando fs.promises


dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Hero.deleteMany();
        await Villain.deleteMany();
        console.log('Datos existentes eliminados de la base de datos.');

        // INICIO DE CAMBIO: Cargar los datos JSON usando la nueva función readJsonFile
        // COMENTARIO: Asegúrate de que los nombres de archivo aquí coincidan EXACTAMENTE con los tuyos.
        // Si tu archivo de héroes se llama 'superheroes.json' y el de villanos 'villains.json'.
        const heroesData = await readJsonFile(path.join(__dirname, 'data', 'superheroes.json')); // <-- CAMBIO AQUÍ
        const villainsData = await readJsonFile(path.join(__dirname, 'data', 'villains.json'));     // <-- CAMBIO AQUÍ
        // FIN DE CAMBIO: Cargar los datos JSON usando la nueva función readJsonFile

        await Hero.insertMany(heroesData);
        await Villain.insertMany(villainsData);

        console.log('Datos importados exitosamente a MongoDB!');
        process.exit();
    } catch (error) {
        console.error(`Error al importar datos a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Hero.deleteMany();
        await Villain.deleteMany();
        console.log('Datos destruidos exitosamente!');
        process.exit();
    } catch (error) {
        console.error(`Error al destruir datos: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}