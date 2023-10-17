const getDb = require("../../../config/getDb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require('../../../config/validationSchemas');
const savePhotoService = require("../../services/savePhotoService");
const errorService = require("../../services/errorService");


async function registerUser(req, res, next) {
  let connection;
  try {
    const { name, email, password } = req.body;

    const { error } = registerSchema.validate(req.body);

    if (error) {
      console.error('Error de validación:', error.details);
      throw errorService.createError(400, 'ValidationError', 'Error de validación', error.details);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    connection = await getDb();
    const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      throw errorService.emailAlreadyRegisteredError();
    }

    const insertUserResult = await connection.query(
      'INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)',
      [name, hashedPassword, name, email]
    );

    if (insertUserResult[0].affectedRows === 1) {
      const userId = insertUserResult[0].insertId;
      const token = jwt.sign({ id: userId, username: name, email }, process.env.JWT_SECRET);

      res.status(201).json({ message: 'Usuario registrado con éxito', id: userId, token });
    } else {
      throw errorService.createError(500, 'DatabaseError', 'Error al guardar el usuario en la base de datos.');
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}


async function loginUser(req, res, next) {
  let connection;
  try {
    const { id, password } = req.body;
    connection = await getDb();

    // Valida los datos de entrada con Joi
    const { error } = loginSchema.validate(req.body);

    if (error) {
      console.error('Error de validación:', error.details);
      return res.status(400).json({ message: 'Error de validación', details: error.details });
    }

    const [[user]] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);

    if (!user) {
      throw errorService.notFoundError();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw errorService.invalidCredentialsError();
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        userRole: user.userRole,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      name: user.name,
      id: user.id,
      userRole: user.userRole,
      token,
    });
  } catch (error) {
    console.error('Error en loginUser:', error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
}


async function logoutUser(req, res) {
  try {
    console.log("Cierre de sesión exitoso.");
    res.json({ message: "Cierre de sesión exitoso" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }  finally {
    //if (connection) connection.release();
  }
}

async function getUserDetails(req, res, next) {
  let connection;
  try {
    const { userId } = req.params;
    connection = await getDb();

    if (userId) {
      const [user] = await connection.query(
        "SELECT id, username, name, email, profile_photo, other_details, created_at, userRole FROM users WHERE id = ?",
        [userId]
      );

      if (!user) {
        throw createError(404, 'Usuario no encontrado', 'El usuario no existe.');
      }

      delete user[0].password;

      const responseData = {
        status: "ok",
        message: "Usuario encontrado",
        data: user,
      };

      res.json(responseData);
    } else {
      const [users] = await connection.query(
        "SELECT id, username, name, email, profile_photo, other_details, created_at, userRole FROM users"
      );

      const usersWithoutPassword = users.map((user) => {
        delete user.password;
        return user;
      });

      const responseData = {
        status: "ok",
        message: "Perfiles de usuario encontrados",
        data: usersWithoutPassword,
      };

      res.json(responseData);
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}


async function updateUser(req, res, next) {
  let connection;
  const { userId } = req.params;
  const { username, name, email, other_details, userRole } = req.body; // Agrega userRole

  try {
    connection = await getDb();

    if (req.user.userRole !== "admin" && req.user.id !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para actualizar este usuario." });
    }

    const updateValues = [];
    const updateFields = [];

    if (username) {
      updateFields.push("username = ?");
      updateValues.push(username);
    }
    if (userRole) {
      updateFields.push("userRole = ?");
      updateValues.push(userRole);
    }

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    // Actualiza la foto de perfil si se proporciona
    if (req.files && req.files.profile_photo) {
      const imgData = req.files.profile_photo.data;
      const width = 200;
    
      const newProfilePhotoName = await savePhotoService(imgData, width);
      updateFields.push("profile_photo = ?");
      updateValues.push(newProfilePhotoName);
    
      // Agregar el campo updated_at
      updateFields.push("updated_at = NOW()"); // Utiliza la función NOW() de MySQL para obtener la fecha y hora actuales
    }
    

    if (other_details) {
      updateFields.push("other_details = ?");
      updateValues.push(other_details);
    }

    const updateQuery = `UPDATE users SET ${updateFields.join(
      ", "
    )} WHERE id = ?`;
    updateValues.push(userId);

    console.log("Update Query:", updateQuery);
    console.log("Update Values:", updateValues);

    const [updateResult] = await connection.query(updateQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    console.log("Perfil de usuario actualizado con éxito.");
    res.json({ message: "Perfil de usuario actualizado con éxito" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}


async function deleteUser(req, res, next) {
  let connection;
  const { userId } = req.params;

  try {
    connection = await getDb();

    if (req.user.userRole !== "admin") {
      throw createError(403, 'Acceso no autorizado', 'No tienes permisos para eliminar este usuario.');
    }

    await connection.query("DELETE FROM records WHERE user_id = ?", [userId]);

    const [deleteUserResult] = await connection.query("DELETE FROM users WHERE id = ?", [userId]);

    if (deleteUserResult.affectedRows === 0) {
      throw createError(404, 'Usuario no encontrado', 'El usuario no existe.');
    }

    console.log("Cuenta de usuario eliminada con éxito.");
    res.json({ message: "Cuenta de usuario eliminada con éxito" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  } 
}

async function getUserProfilePhoto(req, res, next) {
  let connection;
  try {
    const { userId } = req.params;
    connection = await getDb();

    const [user] = await connection.query(
      "SELECT profile_photo FROM users WHERE id = ?",
      [userId]
    );

    if (!user || !user[0].profile_photo) {
      return res.status(404).json({ error: "Usuario o imagen de perfil no encontrados." });
    }

    // Construir la ruta completa de la imagen de perfil
    const profilePhotoPath = path.join(
      __dirname,
      "..",
      "..",
      process.env.UPLOADS_DIR,
      user[0].profile_photo
    );

    // Verificar si el archivo de la imagen de perfil existe
    const exists = await fs.promises.access(profilePhotoPath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return res.status(404).json({ error: "Imagen de perfil no encontrada." });
    }

    // Enviar la imagen como respuesta
    res.sendFile(profilePhotoPath);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUser,
  deleteUser,
  getUserProfilePhoto,
};
