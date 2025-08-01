require('dotenv').config(); // Asegúrate de cargar las variables de entorno al inicio
const app = require('./app');

const PORT = process.env.PORT || 3000; // Obtiene el puerto del .env o usa 3000 por defecto

app.listen(PORT, () => {
    console.log(`Servidor de API escuchando en http://localhost:${PORT}`);
    console.log(`Frontend disponible en http://localhost:${PORT}`);
});