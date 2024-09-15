import { createConnection } from "../../config/db.js";

export class Comentario {
    constructor(idComentario, comentario, idTipoComentario, idTicket) {
        this.idComentario = idComentario;
        this.comentario = comentario;
        this.idTipoComentario = idTipoComentario;
        this.idTicket = idTicket;
    }

    static async getAll() {
        const query =
            "SELECT idComentario, comentario, fechaComentario, idTipoComentario, idTicket FROM Comentarios;";
        let connection;
        try {
            connection = await createConnection();
            const [results] = await connection.query(query);

            if (results.length === 0) {
                console.log("No se encontraron Comentarios");
                return [];
            }
            console.table(results);
            return results;
        } catch (error) {
            throw new Error("Error al obtener comentarios.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async getById(idComentario) {
        const query =
            "SELECT idComentario, comentario, fechaComentario, idTipoComentario, idTicket FROM Comentarios WHERE idComentario = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idComentario]);
            if (result.length === 0) {
                console.log(
                    "Model: No se encontraron datos para el id=",
                    idComentario
                );
                return null;
            }

            return result[0];
        } catch (error) {
            console.error("Error al obtener datos");
            throw new Error("Error al obtener comentario.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion cerrada.");
            }
        }
    }

    static async create(comentario, idTipoComentario, idTicket) {
        const query =
            "INSERT INTO Comentarios (comentario, fechaComentario, idTipoComentario, idTicket) VALUES (?, NOW(), ?, ?);";
        let connection;
        try {
            connection = await createConnection();

            // Verificar que las claves foráneas existen
            const tipoComentarioExists = await this.tipoComentarioExists(
                idTipoComentario
            );
            if (!tipoComentarioExists) {
                throw new Error("El idTipoComentario no es válido.");
            }

            const ticketExists = await this.ticketExists(idTicket);
            if (!ticketExists) {
                throw new Error("El idTicket no es válido.");
            }

            const [result] = await connection.query(query, [
                comentario,
                idTipoComentario,
                idTicket,
            ]);
            const newComment = await this.getById(result.insertId);
            return newComment;
        } catch (error) {
            console.error("Error al crear el comentario.");
            throw new Error(error.message || "Error al crear comentario.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion cerrada.");
            }
        }
    }

    static async update(idComentario, comentario, idTipoComentario, idTicket) {
        const query =
            "UPDATE Comentarios SET comentario = ?, idTipoComentario = ?, idTicket = ? WHERE idComentario = ?;";
        let connection;
        try {
            connection = await createConnection();

            // Verificar que las claves foráneas existen
            const tipoComentarioExists = await this.tipoComentarioExists(
                idTipoComentario
            );
            if (!tipoComentarioExists) {
                throw new Error("El idTipoComentario no es válido.");
            }

            const ticketExists = await this.ticketExists(idTicket);
            if (!ticketExists) {
                throw new Error("El idTicket no es válido.");
            }

            const [result] = await connection.query(query, [
                comentario,
                idTipoComentario,
                idTicket,
                idComentario,
            ]);
            if (result.affectedRows === 0) {
                console.log(
                    "Model: No se encontró el comentario con id=",
                    idComentario
                );
                return null;
            }
            const updatedComment = await this.getById(idComentario);

            return updatedComment;
        } catch (error) {
            console.error("Error al actualizar el comentario.");
            throw new Error(error.message || "Error al actualizar comentario.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async delete(idComentario) {
        const query = "DELETE FROM Comentarios WHERE idComentario = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idComentario]);
            if (result.affectedRows === 0) {
                return null;
            }

            return idComentario;
        } catch (error) {
            throw new Error("Error al eliminar comentario.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async tipoComentarioExists(idTipoComentario) {
        const query =
            "SELECT COUNT(*) AS count FROM TiposComentarios WHERE idTipoComentario = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idTipoComentario]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error al verificar el idTipoComentario.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async ticketExists(idTicket) {
        const query =
            "SELECT COUNT(*) AS count FROM Tickets WHERE idTicket = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idTicket]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error al verificar el idTicket.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}
