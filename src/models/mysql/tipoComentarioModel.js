import {createConnection} from '../../config/db.js'


export class TipoComentario {
    constructor(idTipoComentario, tipoComentario) {
        this.idTipoComentario = idTipoComentario
        this.tipoComentario = tipoComentario
    }

    static async getAll() {
        const query = 'SELECT idTipoComentario, tipoComentario FROM TiposComentarios;'
        let connection
        try {
            connection = await createConnection()
            const [results] = await connection.query(query)
            if (results.length === 0) {
                console.log("Model: No se encontraron datos")
                return []
            }

            console.table(results)
            return results
        } catch (error) {
            console.error("Error al obtener datos de TiposComentarios.")
            throw new Error("Error en la base de datos al obtener los datos")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async getById(idTipoComentario) {
        const query = 'SELECT idTipoComentario, tipoComentario FROM TiposComentarios WHERE idTipoComentario = ?;'
        let connection

        try {
            connection = await createConnection()
            const [result] = await connection.query(query, [idTipoComentario])

            if (result.length === 0) {
                console.log("Model: No se encontraron datos para el id =", idTipoComentario)
                return null
            }

            return result[0]
        } catch (error) {
            console.error("Error al obtener el tipo de comentario para el id", idTipoComentario)
            throw new Error("Error en la base de datos.")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async create(tipoComentario) {
        const query = 'INSERT INTO TiposComentarios (tipoComentario) VALUES (?);'
        const searchQuery = 'SELECT * FROM TiposComentarios WHERE tipoComentario = ?;'
        let connection

        try {
            connection = await createConnection()
            const [searchResults] = await connection.query(searchQuery, [tipoComentario])

            if (searchResults.length > 0) {
                console.log("Model: El tipo de comentario ya existe.")
                throw new Error("El tipo de comentario ya existe.")
            }

            const [result] = await connection.query(query, [tipoComentario])

            const newEntry = await this.getById(result.insertId)
            return newEntry
        } catch (error) {
            console.error("Error al crear el tipo de comentario.")
            throw new Error(error.message || "Error en la base de datos.")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async update(idTipoComentario, tipoComentario) {
        const query = 'UPDATE TiposComentarios SET tipoComentario = ? WHERE idTipoComentario = ?;'
        const searchQuery = 'SELECT * FROM TiposComentarios WHERE tipoComentario = ? AND idTipoComentario != ?;'
        let connection

        try {
            connection = await createConnection()

            const [searchResult] = await connection.query(searchQuery, [tipoComentario, idTipoComentario])

            if (searchResult.length > 0) {
                console.log("Model: El tipo de comentario ya existe.")
                throw new Error("El tipo de comentario ya existe.")
            }

            const [result] = await connection.query(query, [tipoComentario, idTipoComentario])

            if (result.affectedRows === 0) {
                return null
            }

            const updatedEntry = await this.getById(idTipoComentario)
            return updatedEntry

        } catch (error) {
            console.error("Error al actualizar el tipo de comentario.")
            throw new Error(error.message || "Error en la base de datos.")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async delete(idTipoComentario) {
        const query = 'DELETE FROM TiposComentarios WHERE idTipoComentario = ?;'
        let connection

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idTipoComentario])

            if (result.affectedRows === 0) {
                return null
            }

            return idTipoComentario
        } catch (error) {
            console.error("Error al eliminar el tipo de comentario.")
            throw new Error(error.message || "Error en la base de datos.")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }
}