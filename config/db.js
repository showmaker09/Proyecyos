// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carga las variables de entorno desde .env
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Opciones de conexión recomendadas para evitar advertencias de deprecación
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, // Deprecated in Mongoose 6+
            // useFindAndModify: false, // Deprecated in Mongoose 6+
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Sale del proceso con un código de error
    }
};

export default connectDB;