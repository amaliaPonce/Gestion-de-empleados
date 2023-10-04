const getDb = require("../../../config/getDb");

async function registerCheckin(req, res, next) {
  try {
    const userId = req.user.id;

    const connection = await getDb();
    await connection.query(
      "INSERT INTO records (user_id, type) VALUES (?, ?)",
      [userId, "Entry"]
    );

    console.log("Entrada registrada con éxito.");
    res.status(201).json({ message: "Entrada registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar entrada:", error);
    next(error);
  }
}


async function registerCheckout(req, res, next) {
  try {
    const userId = req.user.id;

    const connection = await getDb();
    await connection.query(
      "INSERT INTO records (user_id, type) VALUES (?, ?)",
      [userId, "Exit"]
    );

    console.log("Salida registrada con éxito.");
    res.status(201).json({ message: "Salida registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    next(error);
  }
}

async function getFichajes(req, res, next) {
  try {
    const { userId } = req.query;

    const connection = await getDb();
    let query = "SELECT * FROM records";
    const values = [];

    if (userId) {
      query += " WHERE user_id = ?";
      values.push(userId);
    }

    const [fichajes] = await connection.query(query, values);

    res
      .status(200)
      .json({ message: "Historial de fichajes obtenido con éxito", fichajes });
  } catch (error) {
    console.error("Error al obtener historial de fichajes:", error);
    next(error);
  }
}
async function getEstado(req, res, next) {
    try {
      const { userId } = req.query;
  
      // Comprueba si se proporciona un userId en la consulta
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Se requiere un userId en la consulta" });
      }
  
      // Obtén los registros más recientes del usuario
      const connection = await getDb();
      const [latestRecord] = await connection.query(
        "SELECT * FROM records WHERE user_id = ? ORDER BY time DESC LIMIT 1",
        [userId]
      );
  
      // Agrega console.log para depuración
      console.log('Latest Record:', latestRecord);

      if (!latestRecord) {
        console.log('No se encontraron registros para el usuario.');
        return res.status(200).json({ message: "El usuario está fuera" });
      }
      
      console.log('Latest Record Type:', latestRecord.type);
      
      if (latestRecord.length > 0) {
        const latestRecordType = latestRecord[0].type;
        console.log('Latest Record Type:', latestRecordType);
      
        if (latestRecordType === "Entry") {
          console.log('El usuario está dentro.');
          return res.status(200).json({ message: "El usuario está dentro" });
        } else if (latestRecordType === "Exit") {
          console.log('El usuario está fuera.');
          return res.status(200).json({ message: "El usuario está fuera" });
        }
      }
      
      console.log('No se encontraron registros para el usuario o el tipo de registro es desconocido.');
      return res.status(200).json({ message: "Estado desconocido" });
            
    } catch (error) {
      console.error("Error al obtener estado actual del empleado:", error);
      next(error);
    }
  }
  
  
  
module.exports = {
  registerCheckin,
  registerCheckout,
  getFichajes,
  getEstado,
};
