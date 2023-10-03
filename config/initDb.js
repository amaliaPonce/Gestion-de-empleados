require("dotenv").config();
const getDb = require("./getDb");
const bcrypt = require("bcrypt");

async function createDatabase() {
  let connection;

  try {
    connection = await getDb();

    // Desactivar restricciones de clave externa temporalmente (opcional)
    await connection.query("SET FOREIGN_KEY_CHECKS=0;");

    await connection.query("DROP TABLE IF EXISTS users");

    // Crear la tabla de usuarios.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        profile_photo VARCHAR(255),
        userRole ENUM('admin', 'user') DEFAULT 'user',
        other_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("¡Tabla de usuarios creada!");

    // Crear la tabla de fichajes.
    await connection.query(`
        CREATE TABLE IF NOT EXISTS records (
          id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          user_id INT UNSIGNED NOT NULL,
          type ENUM('Entry', 'Exit') NOT NULL,
          time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
      `);

    console.log("¡Tabla de records creada!");

    // Activar restricciones de clave externa nuevamente (opcional)
    await connection.query("SET FOREIGN_KEY_CHECKS=1;");

    // Creando usuario admin
    const { ADMIN_EMAIL, ADMIN_PWD } = process.env;

    const hashedPassword = await bcrypt.hash(ADMIN_PWD, 10);

    await connection.query(
      "INSERT INTO users (email, password, userRole, name, username) VALUES (?, ?, ?, ?, ?)",
      [ADMIN_EMAIL, hashedPassword, "admin", "Administrador", "admin_username"]
    );
    
  } catch (error) {
    console.error(
      "Error al crear la base de datos y la tabla de usuarios:",
      error
    );
  } finally {
    if (connection) connection.release();
  }
}

async function initDb() {
  try {
    await createDatabase();
  } catch (error) {
    console.error("Error en la creación de la base de datos:", error);
  }
}

initDb();
