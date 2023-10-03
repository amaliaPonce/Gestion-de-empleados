// Función para buscar un usuario por su ID.
async function findById(connection, userId) {
    const [users] = await connection.query(
        `SELECT id FROM users WHERE id = ?`,
        [userId]
    );

    return users.length > 0 ? users[0] : null;
}

module.exports = {
    findById,
};
