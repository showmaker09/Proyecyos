
// este codigo define un controlador de usuario para manejar las peticiones HTTP relacionadas con los usuarios
const userModel = require('../models/userModel');

const userController = {
    getAllUsers: (req, res) => {
        userModel.getAllUsers((err, users) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(200).json(users);
        });
    },

    getUserById: (req, res) => {
        const userId = req.params.id;
        userModel.getUserById(userId, (err, user) => {
            if (err) {
                console.error('Error al obtener usuario por ID:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        });
    },

    createUser: (req, res) => {
        const userData = req.body; // Los datos del nuevo usuario vienen en el cuerpo de la petición
        userModel.createUser(userData, (err, newUserId) => {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente', id: newUserId });
        });
    },

    updateUser: (req, res) => {
        const userId = req.params.id;
        const userData = req.body;
        userModel.updateUser(userId, userData, (err, affectedRows) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado o no se realizaron cambios' });
            }
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        });
    },

    deleteUser: (req, res) => {
        const userId = req.params.id;
        userModel.deleteUser(userId, (err, affectedRows) => {
            if (err) {
                console.error('Error al eliminar usuario:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        });
    }
};

module.exports = userController;