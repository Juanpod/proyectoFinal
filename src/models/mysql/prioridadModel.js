import { createConnection } from "../../config/db.js";

export class Prioridad {
    constructor(idPrioridad, nombrePrioridad) {
        this.idPrioridad = idPrioridad;
        this.nombrePrioridad = nombrePrioridad;
    }

    static async getAll() {
        const query =
            "SELECT idPrioridad, nombrePrioridad FROM Prioridades ORDER BY idPrioridad DESC;";
        let connection;
        try {
            connection = await createConnection();
            const [results] = await connection.query(query);
            if (results.length === 0) {
                console.log("Model: No se encontraron datos");
                return [];
            }
            console.table(results);
            return results;
        } catch (error) {
            console.error("Error al obtener datos de Prioridades.");
            throw new Error("Error en la base de datos al obtener los datos");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async getById(idPrioridad) {
        const query =
            "SELECT idPrioridad, nombrePrioridad FROM Prioridades WHERE idPrioridad = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idPrioridad]);
            if (result.length === 0) {
                console.log(
                    "Model: No se encontraron datos para el id =",
                    idPrioridad
                );
                return null;
            }
            return result[0];
        } catch (error) {
            console.error(
                "Error al obtener la prioridad para el id",
                idPrioridad
            );
            throw new Error("Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async create(nombrePrioridad) {
        const query = "INSERT INTO Prioridades (nombrePrioridad) VALUES (?);";
        const searchQuery =
            "SELECT * FROM Prioridades WHERE nombrePrioridad = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [searchResults] = await connection.query(searchQuery, [
                nombrePrioridad,
            ]);

            if (searchResults.length > 0) {
                console.log("Model: La prioridad ya existe.");
                throw new Error("La prioridad ya existe.");
            }

            const [result] = await connection.query(query, [nombrePrioridad]);

            const newEntry = await this.getById(result.insertId);
            return newEntry;
        } catch (error) {
            console.error("Error al crear la prioridad.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async update(idPrioridad, nombrePrioridad) {
        const query =
            "UPDATE Prioridades SET nombrePrioridad = ? WHERE idPrioridad = ?;";
        const searchQuery =
            "SELECT * FROM Prioridades WHERE nombrePrioridad = ? AND idPrioridad != ?;";
        let connection;

        try {
            connection = await createConnection();

            const [searchResult] = await connection.query(searchQuery, [
                nombrePrioridad,
                idPrioridad,
            ]);

            if (searchResult.length > 0) {
                console.log("Model: La prioridad ya existe.");
                throw new Error("La prioridad ya existe.");
            }

            const [result] = await connection.query(query, [
                nombrePrioridad,
                idPrioridad,
            ]);

            if (result.affectedRows === 0) {
                return null;
            }

            const updatedEntry = await this.getById(idPrioridad);
            return updatedEntry;
        } catch (error) {
            console.error("Error al actualizar la prioridad.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async delete(idPrioridad) {
        const query = "DELETE FROM Prioridades WHERE idPrioridad = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idPrioridad]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idPrioridad;
        } catch (error) {
            console.error("Error al eliminar la prioridad.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }
}
