const getDb = require("../../../config/getDb");

async function registerCheckin(req, res, next) {
  let connection;
  try {
    const userId = req.user.id;

    connection = await getDb();
    await connection.query(
      "INSERT INTO records (user_id, type) VALUES (?, ?)",
      [userId, "Entry"]
    );

    console.log("Entrada registrada con éxito.");
    res.status(201).json({ message: "Entrada registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar entrada:", error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
async function registerCheckout(req, res, next) {
  let connection;
  try {
    const userId = req.user.id;

    connection = await getDb();
    await connection.query(
      "INSERT INTO records (user_id, type) VALUES (?, ?)",
      [userId, "Exit"]
    );

    console.log("Salida registrada con éxito.");
    res.status(201).json({ message: "Salida registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
async function getFichajes(req, res, next) {
  let connection;
  try {
    const { userId } = req.query;

    connection = await getDb();
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
  } finally {
    if (connection) connection.release();
  }
}
async function getEstado(req, res, next) {
  let connection;
  try {
    const { userId } = req.query;

    // Comprueba si se proporciona un userId en la consulta
    if (!userId) {
      return res
        .status(400)
        .json({ error: "Se requiere un userId en la consulta" });
    }

    // Obtén los registros más recientes del usuario
    connection = await getDb();
    const [latestRecord] = await connection.query(
      "SELECT * FROM records WHERE user_id = ? ORDER BY time DESC LIMIT 1",
      [userId]
    );

    if (!latestRecord) {
      return res.status(200).json({ state: "outside" });
    }

    const latestRecordType = latestRecord[0].type;

    if (latestRecordType === "Entry") {
      return res.status(200).json({ state: "inside" });
    } else if (latestRecordType === "Exit") {
      return res.status(200).json({ state: "outside" });
    }

    return res.status(200).json({ state: "unknown" });

  } catch (error) {
    console.error("Error al obtener el estado actual del empleado:", error);
    next(error);
  } finally {
    if (connection) connection.release();
  }
} 
  
module.exports = {
  registerCheckin,
  registerCheckout,
  getFichajes,
  getEstado,
};
