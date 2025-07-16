// models/heroModel.js
import mongoose from 'mongoose'; // Importa mongoose para definir el esquema del modelo

// Define el esquema del héroe
const heroSchema = mongoose.Schema(
    {
        _id: { // <--- Agrega esta definición para el _id
            type: Number,
           // required: true, // Asume que tus IDs siempre estarán presentes
            //unique: true // Asegura que tus IDs sean únicos
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        alias: {
            type: String,
            required: true,
            unique: true,
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
        power: {
            type: Number,
            default: 50,
        },
        health: {
            type: Number,
            default: 100,
        },
    },
    {
        timestamps: true,
        _id: false // <--- IMPORTANTE: Esto le dice a Mongoose que no genere un _id automáticamente si ya le estamos pasando uno.
    }
);

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;