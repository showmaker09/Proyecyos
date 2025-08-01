// este codigo define un controlador para manejar las peticiones HTTP relacionadas con los dueños
const duenoModel = require('../models/duenoModel'); // Importa el modelo de Dueño

const duenoController = {
    // Obtener todos los dueños
    // GET /api/duenos
    getAllDuenos: (req, res) => {
        duenoModel.getAllDuenos((err, duenos) => {
            if (err) {
                console.error('Error al obtener dueños:', err);
                return res.status(500).json({ message: 'Error interno del servidor al obtener dueños.' });
            }
            res.status(200).json(duenos);
        });
    },

    // Obtener un dueño por su ID
    // GET /api/duenos/:id
    getDuenoById: (req, res) => {
        const duenoId = req.params.id; // Obtiene el ID de los parámetros de la URL
        duenoModel.getDuenoById(duenoId, (err, dueno) => {
            if (err) {
                console.error(`Error al obtener dueño con ID ${duenoId}:`, err);
                return res.status(500).json({ message: 'Error interno del servidor al obtener el dueño.' });
            }
            if (!dueno) {
                return res.status(404).json({ message: 'Dueño no encontrado.' });
            }
            res.status(200).json(dueno);
        });
    },

    // Crear un nuevo dueño
    // POST /api/duenos
    addDueno: (req, res) => {
        const duenoData = req.body; // Los datos del nuevo dueño se esperan en el cuerpo de la petición
        duenoModel.addDueno(duenoData, (err, success) => {
            if (err) {
                console.error('Error al añadir dueño:', err);
                return res.status(500).json({ message: 'Error interno del servidor al añadir el dueño.' });
            }
            if (success) {
                res.status(201).json({ message: 'Dueño añadido exitosamente.' });
            } else {
                res.status(400).json({ message: 'No se pudo añadir el dueño.' }); // En caso de que no se afecte ninguna fila
            }
        });
    },

    // Actualizar un dueño existente
    // PUT /api/duenos/:id
    updateDueno: (req, res) => {
        const duenoId = req.params.id; // Obtiene el ID del dueño a actualizar
        const duenoData = req.body; // Los nuevos datos del dueño se esperan en el cuerpo de la petición
        duenoModel.updateDueno(duenoId, duenoData, (err, success) => {
            if (err) {
                console.error(`Error al actualizar dueño con ID ${duenoId}:`, err);
                return res.status(500).json({ message: 'Error interno del servidor al actualizar el dueño.' });
            }
            if (success) {
                res.status(200).json({ message: 'Dueño actualizado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Dueño no encontrado o no se pudo actualizar.' });
            }
        });
    },

    // Eliminar un dueño
    // DELETE /api/duenos/:id
    deleteDueno: (req, res) => {
        const duenoId = req.params.id; // Obtiene el ID del dueño a eliminar
        duenoModel.deleteDueno(duenoId, (err, success) => {
            if (err) {
                console.error(`Error al eliminar dueño con ID ${duenoId}:`, err);
                return res.status(500).json({ message: 'Error interno del servidor al eliminar el dueño.' });
            }
            if (success) {
                res.status(200).json({ message: 'Dueño eliminado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Dueño no encontrado o no se pudo eliminar.' });
            }
        });
    }
};

module.exports = duenoController;
