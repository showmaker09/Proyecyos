// models/heroModel.js
import mongoose from 'mongoose';
// Define el esquema del villano
// SE NECESITA IMPORTAR MONGOOSE PARA DEFINIR EL ESQUEMA DEL MODELO

const villainSchema = mongoose.Schema(
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

const Villain = mongoose.model('Villain', villainSchema); // Crea el modelo Villain a partir del esquema definido

export default Villain;