import { createConnection } from "../../config/db.js";

export class Equipo {
    constructor(idEquipo, nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo) {
        this.idEquipo = idEquipo;
        this.nombreEquipo = nombreEquipo;
        this.modeloEquipo = modeloEquipo;
        this.ipEquipo = ipEquipo;
        this.idUsuario = idUsuario;
        this.idTipoEquipo = idTipoEquipo;
    }

    static async getAll() {
        const query = 'SELECT idEquipo, nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo FROM Equipos;';
        let connection;
        try {
            connection = await createConnection();
            const [results] = await connection.query(query);
            console.table(results);
            return results;
        } catch (error) {
            console.error("Error al obtener datos");
            throw new Error("Error en la base de datos al obtener los datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada");
            }
        }
    }

    static async getById(idEquipo) {
        const query = 'SELECT idEquipo, nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo FROM Equipos WHERE idEquipo = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idEquipo]);

            if (result.length === 0) {
                console.log("No se encontraron datos para el id=", idEquipo);
                return null;
            }

            console.table(result[0]);
            return result[0];
        } catch (error) {
            console.error("Error al obtener datos");
            throw new Error("Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async create(nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo) {
        const query = 'INSERT INTO Equipos (nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo) VALUES (?, ?, ?, ?, ?);';
        const checkNombreEquipoQuery = 'SELECT nombreEquipo FROM Equipos WHERE nombreEquipo = ?;';
        let connection;

        try {
            connection = await createConnection();

            if(idUsuario){
                // Verificar si el idUsuario existe
                const usuarioExists = await this.usuarioExists(idUsuario);
                if (!usuarioExists) {
                throw new Error("El idUsuario no es válido.");
            }
            }
            
            

            // Verificar si el idTipoEquipo existe
            const tipoEquipoExists = await this.tipoEquipoExists(idTipoEquipo);
            if (!tipoEquipoExists) {
                throw new Error("El idTipoEquipo no es válido.");
            }

            // Verificar si el nombreEquipo ya existe
            const [nombreEquipoResults] = await connection.query(checkNombreEquipoQuery, [nombreEquipo]);
            if (nombreEquipoResults.length > 0) {
                throw new Error("El nombre del equipo ya existe.");
            }

            

            const [result] = await connection.query(query, [nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo]);
            const newEquipo = await this.getById(result.insertId);
            return newEquipo;

        } catch (error) {
            console.error("Error al crear equipo.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async update(idEquipo, nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo) {
        const query = 'UPDATE Equipos SET nombreEquipo = ?, modeloEquipo = ?, ipEquipo = ?, idUsuario = ?, idTipoEquipo = ? WHERE idEquipo = ?;';
        const checkNombreEquipoQuery = 'SELECT nombreEquipo FROM Equipos WHERE nombreEquipo = ? AND idEquipo != ?;';
        
        let connection;

        try {
            connection = await createConnection();

            // Verificar si el idUsuario existe
            const usuarioExists = await this.usuarioExists(idUsuario);
            if (!usuarioExists) {
                throw new Error("El idUsuario no es válido.");
            }

            // Verificar si el idTipoEquipo existe
            const tipoEquipoExists = await this.tipoEquipoExists(idTipoEquipo);
            if (!tipoEquipoExists) {
                throw new Error("El idTipoEquipo no es válido.");
            }

            // Verificar si el nombreEquipo ya existe para otro equipo
            const [nombreEquipoResults] = await connection.query(checkNombreEquipoQuery, [nombreEquipo, idEquipo]);
            if (nombreEquipoResults.length > 0) {
                throw new Error("El nombre del equipo ya existe.");
            }

            

            const [result] = await connection.query(query, [nombreEquipo, modeloEquipo, ipEquipo, idUsuario, idTipoEquipo, idEquipo]);
            if (result.affectedRows === 0) {
                console.log("Model: No se encontró el idRol =", idEquipo)
                return null
            }
            
            const updatedEquipo = await this.getById(idEquipo);
            return updatedEquipo;

        } catch (error) {
            console.error("Error al actualizar equipo.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async delete(idEquipo) {
        const query = 'DELETE FROM Equipos WHERE idEquipo = ?;';
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idEquipo]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idEquipo;

        } catch (error) {
            console.error("Error al eliminar equipo.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async usuarioExists(idUsuario) {
        const query = 'SELECT COUNT(*) AS count FROM Usuarios WHERE idUsuario = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idUsuario]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error en la base de datos al verificar usuario.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async tipoEquipoExists(idTipoEquipo) {
        const query = 'SELECT COUNT(*) AS count FROM TiposEquipos WHERE idTipoEquipo = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idTipoEquipo]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error en la base de datos al verificar tipo de equipo.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}
