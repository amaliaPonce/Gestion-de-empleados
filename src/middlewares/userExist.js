// Importamos las dependencias.
const getDb = require('../../config/getDb');
const userModel = require('../models/userModel');

// Importamos los errores.
const { notFoundError } = require('../services/errorService');

// Función controladora intermedia que lanza un error si no existe un usuario con un id dado.
const userExist = async (req, res, next) => {
    let connection;

    try {
        connection = await getDb();

        const userId = req.user.id;

        const user = await userModel.findById(connection, userId);
        if (!user) {
            console.log('Usuario no encontrado');
            throw errorService.notFoundError(); 
                }

        next();
    } catch (err) {
        console.error('Error en userExist:', error);
        next(error);
          } finally {
        if (connection) connection.release();
    }
};

module.exports = userExist ;
