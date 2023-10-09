const errorController = (error, req, res, next) => { // Cambia 'err' a 'error'
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
};

module.exports = errorController;
