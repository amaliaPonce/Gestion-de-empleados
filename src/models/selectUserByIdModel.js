// Importamos la función que devuelve una conexión con la base de datos.
const getDb = require('../../../config/getDb'); // Ajusta la ruta de acuerdo a tu estructura de carpetas.

// Función que realiza una consulta a la base de datos para seleccionar a un usuario con un id dado.
const selectUserByIdModel = async (userId) => {
  let connection;

  try {
    connection = await getDb();

    // Comprobamos si hay algún usuario con el ID proporcionado.
    const [users] = await connection.query(
      'SELECT id, username, name, email, profile_photo, other_details, created_at FROM users WHERE id = ?',
      [userId]
    );

    // El array de usuarios solo debería contener un único usuario dado que el ID
    // no puede repetirse. Retornamos al usuario que se encuentra en la posición 0,
    // es decir, retornamos el objeto en lugar de retornar un array con un elemento.
    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUserByIdModel;
