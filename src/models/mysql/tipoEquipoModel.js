import { createConnection } from "../../config/db.js";

export class TipoEquipo {
    constructor(idTipoEquipo, tipoEquipo) {
        this.idTipoEquipo = idTipoEquipo;
        this.tipoEquipo = tipoEquipo;
    }

    static async getAll() {
        const query = "SELECT idTipoEquipo, tipoEquipo FROM TiposEquipos;";
        let connection;
        try {
            connection = await createConnection();
            const [results] = await connection.query(query);
            console.log(results);
            if (results.length === 0) {
                console.log("Model: No se encontraron datos");
                return [];
            }

            console.table(results);
            return results;
        } catch (error) {
            console.error("No se encontraron datos");
            throw new Error("Error en la base de datos al obtener los datos");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion a la base de datos cerrada.");
            }
        }
    }
    static async getById(idTipoEquipo) {
        const query =
            "SELECT idTipoEquipo, tipoEquipo FROM TiposEquipos WHERE idTipoEquipo = ?;"; // Se define la query
        console.log("Model: El id a buscar es", idTipoEquipo);
        console.log("Model: La query es:", query);
        let connection;

        try {
            connection = await createConnection(); // Se crea la conexion
            const [result] = await connection.query(query, [idTipoEquipo]); // Se ejecuta la query para obtener el rol con el id buscado.

            if (result.length === 0) {
                console.log(
                    "Model: No se encontraron datos para el id =",
                    idTipoEquipo
                );
                return null;
            }

            console.table(result[0]);
            return result[0];
        } catch (error) {
            console.error("Error al obtener datos para el id", idTipoEquipo);
            throw new Error(
                "Error en la base de datos. No se pudo obtener datos"
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion a la base de datos cerrada");
            } // Se cierra la conexion.
        }
    }
    static async create(tipoEquipo) {
        const query = "INSERT INTO TiposEquipos (tipoEquipo) VALUES (?);";
        const searchQuery = "SELECT * FROM TiposEquipos WHERE tipoEquipo = ?;";
        let connection;

        try {
            connection = await createConnection();
            const [searchResults] = await connection.query(searchQuery, [
                tipoEquipo,
            ]);

            if (searchResults.length > 0) {
                console.log("Model: El nombre ya existe, no se agrega.");
                throw new Error("El nombre ya existe.");
            }

            const [result] = await connection.query(query, [tipoEquipo]);

            console.log("El id creado es", result.insertId);
            const newEntry = await this.getById(result.insertId);
            return newEntry;
        } catch (error) {
            console.error("Error al crear la entrada.");
            throw new Error(
                error.message || "Error en la base de datos. No se pudo crear"
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }
    static async update(idTipoEquipo, tipoEquipo) {
        const query =
            "UPDATE TiposEquipos SET tipoEquipo = ? WHERE idTipoEquipo = ?;"; // Se define la query para actualizar el rol por su id
        const searchQuery =
            "SELECT * FROM TiposEquipos WHERE tipoEquipo = ? AND idTipoEquipo != ?;";
        console.log("Model: El id a actualizar es", idTipoEquipo);
        console.log("Model: El nuevo nombre es", tipoEquipo);
        console.log("Model: La query es:", query);
        let connection;

        try {
            connection = await createConnection(); // Se crea la conexión

            const [searchResult] = await connection.query(searchQuery, [
                tipoEquipo,
                idTipoEquipo,
            ]); // Verificar si el nombre del rol ya existe para otro registro

            if (searchResult.length > 0) {
                console.log(
                    "Model: El nombre de tipo de equipo ya existe para otro tipo, no se puede actualizar."
                );
                throw new Error("El nombre ya existe.");
            }

            console.log("Model: El nuevo nombre no esta duplicado, se procede");
            const [result] = await connection.query(query, [
                tipoEquipo,
                idTipoEquipo,
            ]); // Se ejecuta la query para actualizar el rol con el id requerido

            if (result.affectedRows === 0) {
                console.log(
                    "Model: No se encontró el dato para el id =",
                    idTipoEquipo
                );
                return null;
            } // Verificar si se actualizó alguna fila

            // Obtener el rol actualizado
            const updatedEntry = await this.getById(idTipoEquipo);
            console.log("Actualizado:", updatedEntry);
            return updatedEntry;
        } catch (error) {
            console.error(
                "Error al actualizar la entrada para el id",
                idTipoEquipo
            );
            throw new Error(
                error.message ||
                    "Error en la base de datos. No se pudo actualizar"
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            } // Se cierra la conexión.
        }
    }
    static async delete(idTipoEquipo) {
        const query = "DELETE FROM TiposEquipos WHERE idTipoEquipo = ?;"; // Se define la query
        console.log("Model: El id a eliminar es", idTipoEquipo);
        console.log("Model: La query es:", query);
        let connection;

        try {
            connection = await createConnection(); // Se crea la conexion

            const [result] = await connection.query(query, [idTipoEquipo]); // Se ejecuta la query para eliminar el rol con el id requerido.
            //Si no encuentra roles lanza un error
            if (result.affectedRows === 0) {
                console.log("No se encontró dato para el id=", idTipoEquipo);
                return null;
            }

            return idTipoEquipo; //Si encontró rol, lo regresa.
        } catch (error) {
            console.error(
                error.message ||
                    ("Error al eliminar la entrada con id", idTipoEquipo)
            );
            throw new Error(
                error.message ||
                    "Error en la base de datos. No se pudo obtener el dato"
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion a la base de datos cerrada");
            } // Se cierra la conexion.
        }
    }
}
