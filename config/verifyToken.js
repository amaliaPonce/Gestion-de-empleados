const jwt = require('jsonwebtoken');

// Define el token que deseas verificar (reemplaza con el token real)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJBbWFsaWEiLCJlbWFpbCI6ImFtYWxpYUBleGFtcGxlLmNvbSIsImlhdCI6MTY5NjM1ODc5NX0.Zi3_4Qtwc-dGW6lyIm41rKrxe1a6rDWoH4BKl1r6mGg";

try {
  // Imprime el token JWT antes de verificarlo
  console.log('Token JWT antes de verificar:', token);

  // Verifica el token utilizando la clave secreta (asegúrate de que coincida con la utilizada en el cliente)
  const decodedToken = jwt.verify(token, 'abcd');
  
  // Imprime el contenido decodificado del token
  console.log('Token decodificado:', decodedToken);
  
  // Verifica si el campo 'id' está presente en el token
  if (decodedToken.id) {
    console.log('ID del usuario:', decodedToken.id);
  } else {
    console.log('El token no contiene un ID de usuario.');
  }
} catch (error) {
  console.error('Error al decodificar el token:', error);
}
