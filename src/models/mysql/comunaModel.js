import {createConnection} from '../../config/db.js'


export class Comuna {
    constructor(idComuna, nombreComuna) {
        this.idComuna = idComuna
        this.nombreComuna = nombreComuna
    }

    static async getAll() {
        const query = 'SELECT idComuna, nombreComuna FROM Comunas;'
        let connection
        try {
            connection = await createConnection()
            const [results] = await connection.query(query)
            console.log(results)
            if (results.length === 0) {
                console.log("Model: No se encontraron datos")
                return []
            }

            console.table(results)
            return results
        } catch (error) {
            console.error("No se encontraron datos")
            throw new Error("Error en la base de datos al obtener los datos")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async getById(idComuna) {
        const query = 'SELECT idComuna, nombreComuna FROM Comunas WHERE idComuna = ?;'
        console.log("Model: El id a buscar es", idComuna)
        let connection

        try {
            connection = await createConnection()
            const [result] = await connection.query(query, [idComuna])

            if (result.length === 0) {
                console.log("Model: No se encontraron datos para el id =", idComuna)
                return null
            }

            console.table(result[0])
            return result[0]

        } catch (error) {
            console.error("Error al obtener datos para el id", idComuna)
            throw new Error("Error en la base de datos. No se pudo obtener datos")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada")
            }
        }
    }

    static async create(nombreComuna) {
        const query = 'INSERT INTO Comunas (nombreComuna) VALUES (?);'
        const searchQuery = 'SELECT * FROM Comunas WHERE nombreComuna = ?;'
        let connection

        try {
            connection = await createConnection()
            const [searchResults] = await connection.query(searchQuery, [nombreComuna])

            if (searchResults.length > 0) {
                console.log("Model: El nombre ya existe, no se agrega.")
                throw new Error("El nombre ya existe.")
            }

            const [result] = await connection.query(query, [nombreComuna])

            console.log("El id creado es", result.insertId)
            const newEntry = await this.getById(result.insertId)
            return newEntry
        } catch (error) {
            console.error("Error al crear la entrada.")
            throw new Error(error.message || "Error en la base de datos. No se pudo crear")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async update(idComuna, nombreComuna) {
        const query = 'UPDATE Comunas SET nombreComuna = ? WHERE idComuna = ?;'
        const searchQuery = 'SELECT * FROM Comunas WHERE nombreComuna = ? AND idComuna != ?;'
        console.log("Model: El id a actualizar es", idComuna)
        console.log("Model: El nuevo nombre es", nombreComuna)
        let connection

        try {
            connection = await createConnection()

            const [searchResult] = await connection.query(searchQuery, [nombreComuna, idComuna])

            if (searchResult.length > 0) {
                console.log("Model: El nombre de comuna ya existe para otro registro, no se puede actualizar.")
                throw new Error("El nombre ya existe.")
            }

            const [result] = await connection.query(query, [nombreComuna, idComuna])

            if (result.affectedRows === 0) {
                console.log("Model: No se encontró el dato para el id =", idComuna)
                return null
            }

            const updatedEntry = await this.getById(idComuna)
            return updatedEntry

        } catch (error) {
            console.error("Error al actualizar la entrada para el id", idComuna)
            throw new Error(error.message || "Error en la base de datos. No se pudo actualizar")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

    static async delete(idComuna) {
        const query = 'DELETE FROM Comunas WHERE idComuna = ?;'
        console.log("Model: El id a eliminar es", idComuna)
        let connection

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idComuna])

            if (result.affectedRows === 0) {
                console.log("No se encontró dato para el id=", idComuna)
                return null
            }

            return idComuna;

        } catch (error) {
            console.error("Error al eliminar la entrada con id", idComuna)
            throw new Error(error.message || "Error en la base de datos. No se pudo eliminar el dato")
        } finally {
            if (connection) {
                await connection.end()
                console.log("Model: Conexión a la base de datos cerrada.")
            }
        }
    }

}