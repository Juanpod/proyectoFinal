import { createConnection } from "../../config/db.js";

export class Usuario {
    constructor(idUsuario, nombre, email, password, rut, idRol, idSucursal, telefonoContacto) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rut = rut;
        this.idRol = idRol;
        this.idSucursal = idSucursal;
        this.telefonoContacto = telefonoContacto;
    }

    static async getAll() {
        const query = 'SELECT idUsuario, nombre, email, rut, idRol, idSucursal, telefonoContacto FROM Usuarios;';
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

    static async getById(idUsuario) {
        const query = 'SELECT idUsuario, nombre, email, rut, idRol, idSucursal, telefonoContacto FROM Usuarios WHERE idUsuario = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idUsuario]);

            if (result.length === 0) {
                console.log("No se encontraron datos para el id=", idUsuario);
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

    static async create(nombre, email, password, rut, idRol, idSucursal, telefonoContacto) {
        const query = 'INSERT INTO Usuarios (nombre, email, password, rut, idRol, idSucursal, telefonoContacto) VALUES (?, ?, ?, ?, ?, ?, ?);';
        const checkEmailQuery = 'SELECT email FROM Usuarios WHERE email = ?;';
        const checkRutQuery = 'SELECT rut FROM Usuarios WHERE rut = ?;';
        let connection;
        
        try {
            connection = await createConnection();

            // Verificar si el idRol existe
            const rolExists = await this.rolExists(idRol);
            if (!rolExists) {
                throw new Error("El idRol no es válido.");
            }

            // Verificar si el idSucursal existe
            const sucursalExists = await this.sucursalExists(idSucursal);
            if (!sucursalExists) {
                throw new Error("El idSucursal no es válido.");
            }

            // Verificar si el email ya existe
            const [emailResults] = await connection.query(checkEmailQuery, [email]);
            if (emailResults.length > 0) {
                throw new Error("El email ya existe.");
            }

            // Verificar si el RUT ya existe
            const [rutResults] = await connection.query(checkRutQuery, [rut]);
            if (rutResults.length > 0) {
                throw new Error("El RUT ya existe.");
            }

            const [result] = await connection.query(query, [nombre, email, password, rut, idRol, idSucursal, telefonoContacto]);
            const newUser = await this.getById(result.insertId);
            return newUser;

        } catch (error) {
            console.error("Error al crear usuario.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async update(idUsuario, nombre, email, password, rut, idRol, idSucursal, telefonoContacto) {
        const query = 'UPDATE Usuarios SET nombre = ?, email = ?, password = ?, rut = ?, idRol = ?, idSucursal = ?, telefonoContacto = ? WHERE idUsuario = ?;';
        const checkEmailQuery = 'SELECT email FROM Usuarios WHERE email = ? AND idUsuario != ?;';
        const checkRutQuery = 'SELECT rut FROM Usuarios WHERE rut = ? AND idUsuario != ?;';
        let connection;

        try {
            connection = await createConnection();

            // Verificar si el idRol existe
            const rolExists = await this.rolExists(idRol);
            if (!rolExists) {
                throw new Error("El idRol no es válido.");
            }

            // Verificar si el idSucursal existe
            const sucursalExists = await this.sucursalExists(idSucursal);
            if (!sucursalExists) {
                throw new Error("El idSucursal no es válido.");
            }

            // Verificar si el email ya existe para otro usuario
            const [emailResults] = await connection.query(checkEmailQuery, [email, idUsuario]);
            if (emailResults.length > 0) {
                throw new Error("El email ya existe.");
            }

            // Verificar si el RUT ya existe para otro usuario
            const [rutResults] = await connection.query(checkRutQuery, [rut, idUsuario]);
            if (rutResults.length > 0) {
                throw new Error("El RUT ya existe.");
            }

            const [result] = await connection.query(query, [nombre, email, password, rut, idRol, idSucursal, telefonoContacto, idUsuario]);
            if (result.affectedRows === 0) {
                console.log("Model: No se encontró el id =", idUsuario)
                return null
            }
            const updatedUser = await this.getById(idUsuario);
            
            return updatedUser;

        } catch (error) {
            console.error("Error al actualizar usuario.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async delete(idUsuario) {
        const query = 'DELETE FROM Usuarios WHERE idUsuario = ?;';
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idUsuario]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idUsuario;

        } catch (error) {
            console.error("Error al eliminar usuario.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async rolExists(idRol) {
        const query = 'SELECT COUNT(*) AS count FROM Roles WHERE idRol = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idRol]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error en la base de datos al verificar rol.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    static async sucursalExists(idSucursal) {
        const query = 'SELECT COUNT(*) AS count FROM Sucursales WHERE idSucursal = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idSucursal]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error en la base de datos al verificar sucursal.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}
