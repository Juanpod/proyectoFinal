import { createConnection } from "../../config/db.js";

export class Categoria {
    constructor(idCategoria, nombreCategoria) {
        this.idCategoria = idCategoria;
        this.nombreCategoria = nombreCategoria;
    }

    static async getAll() {
        const query = "SELECT idCategoria, nombreCategoria FROM Categorias;";
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
            console.error("Error al obtener datos de Categorias.");
            throw new Error("Error en la base de datos al obtener los datos");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async getById(idCategoria) {
        const query =
            "SELECT idCategoria, nombreCategoria FROM Categorias WHERE idCategoria = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idCategoria]);

            if (result.length === 0) {
                console.log(
                    "Model: No se encontraron datos para el id =",
                    idCategoria
                );
                return null;
            }

            return result[0];
        } catch (error) {
            console.error(
                "Error al obtener la categoría para el id",
                idCategoria
            );
            throw new Error("Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async create(nombreCategoria) {
        const query = "INSERT INTO Categorias (nombreCategoria) VALUES (?);";
        const searchQuery =
            "SELECT * FROM Categorias WHERE nombreCategoria = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [searchResults] = await connection.query(searchQuery, [
                nombreCategoria,
            ]);

            if (searchResults.length > 0) {
                console.log("Model: La categoría ya existe.");
                throw new Error("La categoría ya existe.");
            }

            const [result] = await connection.query(query, [nombreCategoria]);

            const newEntry = await this.getById(result.insertId);
            return newEntry;
        } catch (error) {
            console.error("Error al crear la categoría.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async update(idCategoria, nombreCategoria) {
        const query =
            "UPDATE Categorias SET nombreCategoria = ? WHERE idCategoria = ?;";
        const searchQuery =
            "SELECT * FROM Categorias WHERE nombreCategoria = ? AND idCategoria != ?;";
        let connection;

        try {
            connection = await createConnection();

            const [searchResult] = await connection.query(searchQuery, [
                nombreCategoria,
                idCategoria,
            ]);

            if (searchResult.length > 0) {
                console.log("Model: La categoría ya existe.");
                throw new Error("La categoría ya existe.");
            }

            const [result] = await connection.query(query, [
                nombreCategoria,
                idCategoria,
            ]);

            if (result.affectedRows === 0) {
                return null;
            }

            const updatedEntry = await this.getById(idCategoria);
            return updatedEntry;
        } catch (error) {
            console.error("Error al actualizar la categoría.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async delete(idCategoria) {
        const query = "DELETE FROM Categorias WHERE idCategoria = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idCategoria]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idCategoria;
        } catch (error) {
            console.error("Error al eliminar la categoría.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }
}
