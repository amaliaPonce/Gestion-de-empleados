const errorService = require('../services/errorService');

const isAdmin = async (req, res, next) => {
    try {

        if (req.user.userRole !== 'admin') {
            throw errorService.invalidCredentialsError();
        } else {
        }


        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAdmin;
