const jwt = require('jsonwebtoken');
const { notAuthenticatedError, decryptionError } = require('../services/errorService');

const authUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      console.log('Token de autenticación no proporcionado.');
      return next(notAuthenticatedError());
    }

    try {
      const tokenInfo = jwt.verify(authorization, process.env.JWT_SECRET);
      req.user = tokenInfo;
      req.body.userId = tokenInfo.id;
      
      next();
    } catch (err) {
      console.log('Error al decodificar el token:', err);
      return next(decryptionError());
    }
  } catch (err) {
    console.log('Error en el middleware authUser:', err);
    next(err);
  }
};

module.exports = authUser;
