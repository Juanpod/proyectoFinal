// importar la conexion a la base de datos
import {createConnection} from '../../config/db.js'


export class Rol {
    constructor(idRol, nombreRol){
        this.idRol = idRol
        this.nombreRol = nombreRol
    }

    static async getAll() {
        const query = 'SELECT idRol, nombreRol FROM Roles;' // Se define la query para obtener todos los nombres de roles
        let connection

        try {
            connection = await createConnection() // Se crea la conexion con la base de datos
            const [roles] = await connection.query(query) // Se ejecuta la query para obtener todos los roles en la base de datos
            
            if (roles.length === 0) {
                console.log("No se encontraron roles.");
                return [];
            } //Si no encuentra roles, regresa un array vacío

            console.table(roles)
            return roles //Si encontró roles, los regresa.
        } catch (error) {
            console.error("Error al obtener los roles");
            throw new Error("Error en la base de datos al obtener los roles.");
        } finally { 
            if (connection) {
                await connection.end()
                console.log("Model: Conexion a la base de datos cerrada")
            } // Se cierra la conexion.
        }
    }

    static async getById(idRol) {
        const query = 'SELECT idRol, nombreRol FROM Roles WHERE idRol = ?;' // Se define la query
        console.log("Model: El id a buscar es", idRol)
        console.log("Model: La query es:", query)
        let connection

        try {
            connection = await createConnection() // Se crea la conexion
            const [rol] = await connection.query(query, [idRol]) // Se ejecuta la query para obtener el rol con el id buscado.
            
            if (rol.length === 0) {
                console.log("No se encontró el rol con el idRol=", idRol);
                return null;
            } //Si no encuentra roles, regresa null

            console.table(rol[0])
            return rol[0] //Si encontró rol, lo regresa.

        } catch (error) {
            console.error("Error al obtener el rol con id", idRol);
            throw new Error("Error en la base de datos. No se pudo obtener el rol.");
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexion a la base de datos cerrada")
            } // Se cierra la conexion.
        }   
    }

    static async create(nombreRol) {
        // Se define la query
        const query = 'INSERT INTO Roles (nombreRol) VALUES (?);' 
        const searchQuery = 'SELECT * FROM Roles WHERE nombreRol = ?;' // ESCRIBIR EL NOMBRE DE LAS COLUMNAS
        console.log("Model: El rol a crear es", nombreRol)
        console.log("Model: La query es:", query)
        let connection

        try {
            connection = await createConnection() // Se crea la conexion

            const [existingRol] = await connection.query(searchQuery, [nombreRol]) //Query para buscar un rol que ya tenga el nombreRol 
            
            if (existingRol.length > 0) {
                console.log("Model: El nombre de rol ya existe, no se agrega");
                throw new Error("El nombre del rol ya existe.")
            } //Si encuentra el nombre de rol existente, envia error.

            const [rol] = await connection.query(query, [nombreRol]) // Se ejecuta la query para crear el nuevo rol
            
            console.log("El id creada es", rol.insertId)

            const newRol = await this.getById(rol.insertId) 
            return newRol

        } catch (error) {
            console.error(error.message || "Error al obtener los roles");
            throw new Error(error.message || "Error en la base de datos. No se pudieron obtener los roles."); 
        } finally {   
            if (connection) {
                await connection.end()
                console.log("Conexion a la base de datos cerrada")
            } // Se cierra la conexion.
        }
    }

    static async update(idRol, nombreRol) {
        const query = 'UPDATE Roles SET nombreRol = ? WHERE idRol = ?;' // Se define la query para actualizar el rol por su id
        const searchQuery = 'SELECT * FROM Roles WHERE nombreRol = ? AND idRol != ?;'
        console.log("Model: El id del rol a actualizar es", idRol);
        console.log("Model: El nuevo nombre del rol es", nombreRol);
        console.log("Model: La query es:", query);
        let connection;

        try {
            connection = await createConnection() // Se crea la conexión

            
            const [existingRoles] = await connection.query(searchQuery, [nombreRol, idRol]) // Verificar si el nombre del rol ya existe para otro registro

            if (existingRoles.length > 0) {
                console.log("Model: El nombre de rol ya existe para otro rol, no se puede actualizar.")
                throw new Error("El nombre de rol ya existe para otro rol.")
            }

            console.log("Model: El nuevo nombre para el rol no esta duplicado, se procede")
            const [result] = await connection.query(query, [nombreRol, idRol]) // Se ejecuta la query para actualizar el rol con el id requerido

            
            if (result.affectedRows === 0) {
                console.log("Model: No se encontró el rol con el idRol =", idRol)
                return null
            } // Verificar si se actualizó alguna fila

            // Obtener el rol actualizado
            const updatedRol = await this.getById(idRol)
            console.log("Rol actualizado:", updatedRol)
            return updatedRol

        } catch (error) {
            console.error("Error al actualizar el rol con id", idRol);
            throw new Error(error.message || "Error en la base de datos. No se pudo actualizar el rol.")
        } finally { 
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            } // Se cierra la conexión.
        }
    }

    static async delete(idRol) {
        const query = 'DELETE FROM Roles WHERE idRol = ?;' // Se define la query
        console.log("Model: El id a eliminar es", idRol)
        console.log("Model: La query es:", query)
        let connection

        try {
            connection = await createConnection() // Se crea la conexion

            const [result] = await connection.query(query, [idRol]) // Se ejecuta la query para eliminar el rol con el id requerido.
            //Si no encuentra roles lanza un error
            if (result.affectedRows === 0) {
                console.log("No se encontró el rol con el idRol=", idRol)
                return null
            }
            
            return idRol //Si encontró rol, lo regresa.

        } catch (error) {
            console.error(error.message || ("Error al eliminar el rol con id", idRol));
            throw new Error(error.message || "Error en la base de datos. No se pudo obtener el rol.");
        } finally {  
            if (connection) {
                await connection.end()
                console.log("Model: Conexion a la base de datos cerrada")
            } // Se cierra la conexion.
        }
    }


}



