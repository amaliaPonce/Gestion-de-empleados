const mysql = require("mysql2/promise");

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool;

const getDb = async () => {
  try {
    if (!pool) {
      const dbConnection = await mysql.createConnection({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        timezone: "Z",
      });

      // Verificar la conexión exitosa
      await dbConnection.query("SELECT 1");

      // Creamos un grupo de conexiones.
      pool = mysql.createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        timezone: "Z",
      });
    }

    // Retornamos una conexión libre.
    return await pool.getConnection();
  } catch (err) {
    console.error(err);
  }
};

// Exportamos la función.
module.exports = getDb;
