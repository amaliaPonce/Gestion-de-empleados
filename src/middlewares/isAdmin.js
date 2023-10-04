// Importamos los errores.
const { invalidCredentialsError } = require('../services/errorservice');

const isAdmin = async (req, res, next) => {
    try {
        console.log("req.user:", req.user); // Agrega este registro de consola para verificar req.user

        if (req.user.userRole !== 'admin') {
            console.log("Usuario no es admin"); // Agrega este registro de consola para verificar el flujo de control
            throw errorService.invalidCredentialsError(); // Lanza un error específico
        } else {
            console.log("Usuario es admin"); // Agrega este registro de consola para verificar el flujo de control
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAdmin;
