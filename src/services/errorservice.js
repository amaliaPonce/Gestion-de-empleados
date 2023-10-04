module.exports = {
    // Errores relacionados con archivos
    deleteFileError: () => createError(500, 'FILE_DELETE_FAILED', 'Error al eliminar el archivo.'),
    saveFileError: () => createError(500, 'FILE_SAVE_FAILED', 'Error al guardar el ejercicio.'),
  
    // Errores de autenticación y autorización
    notAuthenticatedError: () => createError(401, 'NOT_AUTHENTICATED', "Debe enviar un token en el header 'Authorization'."),
    unauthorizedUserError: () => createError(403, 'UNAUTHORIZED', 'El usuario no está autorizado para hacer esta operación.'),
  
    // Errores de registro de usuario
    emailAlreadyRegisteredError: () => createError(409, 'EMAIL_ALREADY_REGISTERED', 'Usuario ya está registrado.'),
    userAlreadyRegisteredError: () => createError(409, 'USER_ALREADY_REGISTERED', 'El nombre de usuario ya está registrado.'),
  
    // Otros errores
    incorrectRecoveryCodeError: () => createError(400, 'INCORRECT_RECOVERY_CODE', 'Código de recuperación incorrecto.'),
    invalidCredentialsError: () => createError(403, 'FORBIDDEN', 'Acceso prohibido debido a credenciales inválidas.'),

    invalidTokenError: () => createError(401, 'INVALID_TOKEN', 'Token inválido.'),
    missingFieldsError: () => createError(400, 'MISSING_FIELDS', 'Faltan campos.'),
    notFoundError: () => createError(404, 'RESOURCE_NOT_FOUND', 'El recurso requerido no existe.'),
    decryptionError: () => createError(500, 'DECRYPTION_ERROR', 'Error al desencriptar.'),
    errorPasswordEmail: () => createError(403, 'ERROR_EMAIL_PASSWORD', 'La contraseña o el email no son correctos.'),
      // Errores relacionados con itinerarios
  itineraryNotFoundError: () => createError(404, 'ITINERARY_NOT_FOUND', 'Itinerario no encontrado.'),
  itineraryOwnershipError: () => createError(403, 'ITINERARY_OWNERSHIP_ERROR', 'No tienes permisos para editar o eliminar este itinerario.'),

  // Errores relacionados con actividades
  activityNotFoundError: () => createError(404, 'ACTIVITY_NOT_FOUND', 'Actividad no encontrada.'),
  activityOwnershipError: () => createError(403, 'ACTIVITY_OWNERSHIP_ERROR', 'No tienes permisos para editar o eliminar esta actividad.'),

  };
  
  // Función auxiliar para crear un error con un código de estado, código y mensaje específicos.
  function createError(httpStatus, code, message) {
    const error = new Error(message);
    error.status = httpStatus;
    error.code = code;
    return error;
  }
  