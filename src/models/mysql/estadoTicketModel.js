import { createConnection } from '../../config/db.js';

export class EstadoTicket {
    constructor(idEstadoTicket, estadoTicket) {
        this.idEstadoTicket = idEstadoTicket;
        this.estadoTicket = estadoTicket;
    }

    static async getAll() {
        const query = 'SELECT idEstadoTicket, estadoTicket FROM EstadosTickets;';
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
            console.error("Error al obtener datos de EstadosTickets.");
            throw new Error("Error en la base de datos al obtener los datos");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async getById(idEstadoTicket) {
        const query = 'SELECT idEstadoTicket, estadoTicket FROM EstadosTickets WHERE idEstadoTicket = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idEstadoTicket]);
            if (result.length === 0) {
                console.log("Model: No se encontraron datos para el id =", idEstadoTicket);
                return null;
            }
            return result[0];
        } catch (error) {
            console.error("Error al obtener el estado para el id", idEstadoTicket);
            throw new Error("Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async create(estadoTicket) {
        const query = 'INSERT INTO EstadosTickets (estadoTicket) VALUES (?);';
        const searchQuery = 'SELECT * FROM EstadosTickets WHERE estadoTicket = ?;';
        let connection;

        try {
            connection = await createConnection();
            const [searchResults] = await connection.query(searchQuery, [estadoTicket]);

            if (searchResults.length > 0) {
                console.log("Model: El estado ya existe.");
                throw new Error("El estado ya existe.");
            }

            const [result] = await connection.query(query, [estadoTicket]);

            const newEntry = await this.getById(result.insertId);
            return newEntry;
        } catch (error) {
            console.error("Error al crear el estado.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async update(idEstadoTicket, estadoTicket) {
        const query = 'UPDATE EstadosTickets SET estadoTicket = ? WHERE idEstadoTicket = ?;';
        const searchQuery = 'SELECT * FROM EstadosTickets WHERE estadoTicket = ? AND idEstadoTicket != ?;';
        let connection;

        try {
            connection = await createConnection();

            const [searchResult] = await connection.query(searchQuery, [estadoTicket, idEstadoTicket]);

            if (searchResult.length > 0) {
                console.log("Model: El estado ya existe.");
                throw new Error("El estado ya existe.");
            }

            const [result] = await connection.query(query, [estadoTicket, idEstadoTicket]);

            if (result.affectedRows === 0) {
                return null;
            }

            const updatedEntry = await this.getById(idEstadoTicket);
            return updatedEntry;

        } catch (error) {
            console.error("Error al actualizar el estado.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }

    static async delete(idEstadoTicket) {
        const query = 'DELETE FROM EstadosTickets WHERE idEstadoTicket = ?;';
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idEstadoTicket]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idEstadoTicket;
        } catch (error) {
            console.error("Error al eliminar el estado.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión a la base de datos cerrada.");
            }
        }
    }
}
