const express = require('express');
const router = express.Router();

// Importa tus controladores aquí
const userController = require('../controllers/userControllers/userController');
const checkController = require('../controllers/checkController/checkController');


// Importa el middleware de autenticación
const { authUser, userExist, isAdmin } = require('../middlewares');

// Endpoints de Autenticación y Usuarios

//Registro
router.post('/api/register', userController.registerUser);
//login
router.post('/api/login', userController.loginUser);
//logout
router.post('/api/logout', userController.logoutUser);
// Ruta para obtener el perfil de un usuario por su ID
router.get('/users/profile/:userId', authUser, userExist,isAdmin, userController.getUserDetails);
// Ruta para obtener el perfil de todos los usuarios
router.get('/users/profile',authUser,userExist,isAdmin, userController.getUserDetails);
// Actualizar un usuario
router.put('/api/users/:userId', authUser,userExist,isAdmin, userController.updateUser);
// Eliminar un usuario
router.delete('/api/users/:userId', authUser,userExist,isAdmin, userController.deleteUser);

// Ruta para hacer checking
router.post('/api/checkin', authUser, userExist, checkController.registerCheckin);

// Ruta para hacer checkout
router.post('/api/checkout', authUser, userExist, checkController.registerCheckout);

// Ruta para ver la lista de fichajes
router.get('/api/fichajes', authUser, userExist, checkController.getFichajes);
// Ruta para ver el estado del usuario
router.get('/api/estado', authUser, userExist, checkController.getEstado);




// Exporta el router para su uso en tu archivo principal (app.js)
module.exports = router;
