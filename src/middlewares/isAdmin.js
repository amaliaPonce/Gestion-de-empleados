const errorService = require('../services/errorService');

const isAdmin = async (req, res, next) => {
    try {
        console.log("req.user:", req.user);

        if (req.user.userRole !== 'admin') {
            console.log("Usuario no es admin"); 
            throw errorService.invalidCredentialsError();
        } else {
            console.log("Usuario es admin"); 
        }


        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAdmin;
