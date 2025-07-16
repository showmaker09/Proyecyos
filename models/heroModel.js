// models/heroModel.js
import mongoose from 'mongoose'; // Importa mongoose para definir el esquema del modelo
// Define el esquema del héroe
//SE NECESITA IMPORTAR MONGOOSE PARA DEFINIR EL ESQUEMA DEL MODELO
const heroSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Elimina espacios en blanco al inicio/final
        },
        alias: {
            type: String,
            required: true,
            unique: true, // Asegura que cada alias sea único
            trim: true,
        },
        city: {
            type: String,
            default: 'Unknown',
        },
        team: {
            type: String,
            default: 'Unaffiliated',
        },
        // Añade campos para el poder y la salud si no los tienes en tu modelo Hero
        power: {
            type: Number,
            default: 50, // Valor por defecto
        },
        health: {
            type: Number,
            default: 100, // Valor por defecto
        },
    },
    {
        timestamps: true, // Añade automáticamente createdAt y updatedAt
    }
);

const Hero = mongoose.model('Hero', heroSchema); // Crea el modelo Hero a partir del esquema definido

export default Hero;