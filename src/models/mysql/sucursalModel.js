import { createConnection } from "../../config/db.js";

export class Sucursal {
    constructor(idSucursal, nombreSucursal, direccionSucursal, idComuna) {
        this.idSucursal = idSucursal;
        this.nombreSucursal = nombreSucursal;
        this.direccionSucursal = direccionSucursal;
        this.idComuna = idComuna;
    }

    static async getAll() {
        const query =
            "SELECT idSucursal, nombreSucursal, direccionSucursal, idComuna FROM Sucursales;";
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
            console.error("Error al obtener datos");
            throw new Error("Error en la base de datos al obtener los datos");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion a la base de datos cerrada");
            }
        }
    }

    static async getById(idSucursal) {
        const query =
            "SELECT idSucursal, nombreSucursal, direccionSucursal, idComuna FROM Sucursales WHERE idSucursal = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idSucursal]);

            if (result.length === 0) {
                console.log(
                    "Model: No se encontraron datos para el id=",
                    idSucursal
                );
                return null;
            }

            console.table(result[0]);

            return result[0];
        } catch (error) {
            console.error("Error al obtener los datos para el id", idSucursal);
            throw new Error(
                "Error en la base de datos. No se pudo obtener datos."
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexion a la base de datos cerrada");
            }
        }
    }

    static async create(nombreSucursal, direccionSucursal, idComuna) {
        const query =
            "INSERT INTO Sucursales (nombreSucursal, direccionSucursal, idComuna) VALUES (?,?,?);";
        const searchQuery =
            "SELECT nombreSucursal FROM Sucursales WHERE nombreSucursal = ?;";
        let connection;

        try {
            connection = await createConnection();

            // Verificar si el idComuna existe
            const comunaExists = await this.comunaExists(idComuna);
            if (!comunaExists) {
                console.log(
                    "Model: La comuna con id =",
                    idComuna,
                    "no existe."
                );
                throw new Error("El idComuna no es válido.");
            }

            //Verificar si el nombre de la Comuna Existe
            const [searchResults] = await connection.query(searchQuery, [
                nombreSucursal,
            ]);
            if (searchResults.length > 0) {
                console.log("Model: El nombre ya existe, no se agrega.");
                throw new Error("El nombre ya existe.");
            }

            const [result] = await connection.query(query, [
                nombreSucursal,
                direccionSucursal,
                idComuna,
            ]);
            console.log("El id creado es", result.insertId);
            const newEntry = await this.getById(result.insertId);
            return newEntry;
        } catch (error) {
            console.error("Error al crear la sucursal.");
            throw new Error(
                error.message || "Error en la base de datos. No se pudo crear."
            );
        } finally {
            if (connection) {
                console.log("Model: Conexión a la base de datos cerrada.");
                await connection.end();
            }
        }
    }

    static async update(
        idSucursal,
        nombreSucursal,
        direccionSucursal,
        idComuna
    ) {
        const query =
            "UPDATE Sucursales SET nombreSucursal = ?, direccionSucursal = ?, idComuna = ? WHERE idSucursal = ?;";
        const searchQuery =
            "SELECT * FROM Sucursales WHERE nombreSucursal = ? AND idSucursal != ?;";
        let connection;
        try {
            connection = await createConnection();

            // Verificar si el idComuna existe
            const comunaExists = await this.comunaExists(idComuna);
            if (!comunaExists) {
                console.log(
                    "Model: La comuna con id =",
                    idComuna,
                    "no existe."
                );
                throw new Error("El idComuna no es válido.");
            }

            const [searchResult] = await connection.query(searchQuery, [
                nombreSucursal,
                idSucursal,
            ]);
            if (searchResult.length > 0) {
                console.log(
                    "Model: El nombre de sucursal ya existe para otro registro."
                );
                throw new Error("El nombre ya existe.");
            }

            const [result] = await connection.query(query, [
                nombreSucursal,
                direccionSucursal,
                idComuna,
                idSucursal,
            ]);
            if (result.affectedRows === 0) {
                console.log(
                    "Model: No se encontró el dato para el id =",
                    idSucursal
                );
                return null;
            }

            const updatedEntry = await this.getById(idSucursal);
            return updatedEntry;
        } catch (error) {
            console.error("Error al actualizar la sucursal.");
            throw new Error(
                error.message ||
                    "Error en la base de datos. No se pudo actualizar."
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async delete(idSucursal) {
        const query = "DELETE FROM Sucursales WHERE idSucursal = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idSucursal]);

            if (result.affectedRows === 0) {
                console.log(
                    "Model: No se encontró el dato para el id =",
                    idSucursal
                );
                return null;
            }

            return idSucursal;
        } catch (error) {
            console.error("Error al eliminar la sucursal con id", idSucursal);
            throw new Error(
                error.message ||
                    "Error en la base de datos. No se pudo eliminar el dato."
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async comunaExists(idComuna) {
        const query =
            "SELECT COUNT(*) AS count FROM Comunas WHERE idComuna = ?;";
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idComuna]);
            return result[0].count > 0;
        } catch (error) {
            console.error("Error al verificar la existencia de la comuna.");
            throw new Error(
                "Error en la base de datos al verificar la comuna."
            );
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }
}
