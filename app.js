import express from 'express';
import heroController from './controllers/heroController.js';
import villainController from './controllers/villainController.js';
import swaggerUi from 'swagger-ui-express'; // Importa swagger-ui-express
import YAML from 'yamljs'; // Importa yamljs
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Importa la función de conexión a la base de datos

dotenv.config();

const app = express(); // Crea una instancia de Express que es la aplicación principal
// Conectar a la base de datos
connectDB(); // Llama a la función para conectar a la base de datos MongoDB



// Carga tu archivo swagger.yaml
const swaggerDocument = YAML.load('./docs/swagger.yaml'); // Asegúrate que la ruta sea correcta

app.use(express.json());

// Sirve la documentación de Swagger UI en una ruta específica
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Tus rutas de API existentes
app.use('/api', heroController);
app.use('/api', villainController);

const PORT = process.env.PORT || 3001; // Mejor usar variables de entorno
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});