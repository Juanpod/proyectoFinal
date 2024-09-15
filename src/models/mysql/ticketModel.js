import { createConnection } from "../../config/db.js";

export class Ticket {
    constructor(idTicket, asuntoTicket, descripcionTicket, fechaCreacion, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor) {
        this.idTicket = idTicket;
        this.asuntoTicket = asuntoTicket;
        this.descripcionTicket = descripcionTicket;
        this.fechaCreacion = fechaCreacion;
        this.idEstadoTicket = idEstadoTicket;
        this.idPrioridad = idPrioridad;
        this.idCategoria = idCategoria;
        this.idUsuarioCreador = idUsuarioCreador;
        this.idUsuarioResolutor = idUsuarioResolutor
    }


    static async getAll(){
        const query = 'SELECT idTicket, asuntoTicket, descripcionTicket, fechaCreacion, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor FROM Tickets;'
        let connection
        try {
            connection = await createConnection()
            
            const [results] = await connection.query(query)

            if (results.length === 0) {
                console.log("No se encontraron tickets");
                return []
            }

            console.table(results)
            return results
        } catch(error){
            console.error("Error al obtener ticket");
            throw new Error("Error en la base de datos.");
        } finally {
            if(connection){
                await connection.end()
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async getById(idTicket){
        const query = 'SELECT idTicket, asuntoTicket, descripcionTicket, fechaCreacion, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor FROM Tickets WHERE idTicket=?;'
        let connection
        try {
            connection = await createConnection()
            const [result] =  await connection.query(query, [idTicket])

            console.log(result)

            if(result.length === 0){
                console.log("Model: No se encontraron datos para el id=", idTicket)
                return null
            }

            return result[0]
        } catch (error){
            console.error("Error al obtener datos")
            throw new Error("Error en la base de datos.")
        } finally {
            if(connection){
                
                await connection.end()
                console.log("Model: Conexion cerrada.")
            }
        }

    }

    static async create(asuntoTicket, descripcionTicket, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor){
        const query = 'INSERT INTO Tickets (asuntoTicket, descripcionTicket, fechaCreacion, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?);'
        let connection;
        try {
            connection = await createConnection()

            // Verificar que los id foráneos existen
            const estadoExists = await this.estadoExists(idEstadoTicket)
            if (!estadoExists) {
                throw new Error("El idEstadoTicket no es válido.")
            }

            const prioridadExists = await this.prioridadExists(idPrioridad)
            if (!prioridadExists) {
                throw new Error("El idPrioridad no es válido.")
            }

            const categoriaExists = await this.categoriaExists(idCategoria)
            if (!categoriaExists) {
                throw new Error("El idCategoria no es válido.")
            }

            const usuarioExists = await this.usuarioExists(idUsuarioCreador)
            if (!usuarioExists) {
                throw new Error("El idUsuarioCreador no es válido.")
            }

            if(idUsuarioResolutor){
                const usuarioExists = await this.usuarioExists(idUsuarioResolutor)
                if (!usuarioExists) {
                    throw new Error("El idUsuarioCreador no es válido.")
                }
            }

            const [result] =  await connection.query(query, [asuntoTicket, descripcionTicket, idEstadoTicket, idPrioridad, idCategoria, idUsuarioCreador, idUsuarioResolutor])

            console.log(result)

            const newTicket = await this.getById(result.insertId)
            return newTicket
            
        } catch (error){
            console.error("Error al crear ticket.");
            throw new Error(error.message || "Error en la base de datos.")
        } finally {
            if(connection){
                
                await connection.end()
                console.log("Model: Conexion cerrada.")
            }
        }
    }

    static async update(idTicket, asuntoTicket, descripcionTicket, idEstadoTicket, idPrioridad, idCategoria, idUsuarioResolutor){
        const query = 'UPDATE Tickets SET asuntoTicket = ?, descripcionTicket = ?, idEstadoTicket = ?, idPrioridad = ?, idCategoria = ?, idUsuarioResolutor = ? WHERE idTicket = ?;'
        let connection;

        try {
            connection = await createConnection();

            // Verificar que los id foráneos existen
            const estadoExists = await this.estadoExists(idEstadoTicket);
            if (!estadoExists) {
                throw new Error("El idEstadoTicket no es válido.");
            }

            const prioridadExists = await this.prioridadExists(idPrioridad);
            if (!prioridadExists) {
                throw new Error("El idPrioridad no es válido.");
            }

            const categoriaExists = await this.categoriaExists(idCategoria);
            if (!categoriaExists) {
                throw new Error("El idCategoria no es válido.");
            }

            if(idUsuarioResolutor){
                const usuarioExists = await this.usuarioExists(idUsuarioResolutor)
                if (!usuarioExists) {
                    throw new Error("El idUsuarioResolutor no es válido.")
                }
            }

           

            const [result] = await connection.query(query, [asuntoTicket, descripcionTicket, idEstadoTicket, idPrioridad, idCategoria, idUsuarioResolutor, idTicket]);
            if (result.affectedRows === 0) {
                console.log("Model: No se encontró el ticket con id=", idTicket)
                return null;
            }
            
            const updatedTicket = await this.getById(idTicket);
            return updatedTicket;

        } catch (error) {
            console.error("Error al actualizar ticket.");
            throw new Error(error.message || "Error en la base de datos.");
        } finally {
            if (connection) {
                await connection.end();
                console.log("Model: Conexión cerrada");
            }
        }
    }

    static async delete(idTicket){
        const query = 'DELETE FROM Tickets WHERE idTicket = ?;';
        let connection;

        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idTicket]);

            if (result.affectedRows === 0) {
                return null;
            }

            return idTicket;

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

    static async estadoExists(idEstadoTicket) {
        const query = 'SELECT COUNT(*) AS count FROM EstadosTickets WHERE idEstadoTicket = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idEstadoTicket]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Erroral verificar el idEstadoTicket.")
        } finally {
            if(connection){   
            await connection.end()
            }
        }
    }

    static async prioridadExists(idPrioridad) {
        const query = 'SELECT COUNT(*) AS count FROM Prioridades WHERE idPrioridad = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idPrioridad]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error al verificar el idPrioridad.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    
    static async categoriaExists(idCategoria) {
        const query = 'SELECT COUNT(*) AS count FROM Categorias WHERE idCategoria = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idCategoria]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error al verificar el idCategoria.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
    
    static async usuarioExists(idUsuarioCreador) {
        const query = 'SELECT COUNT(*) AS count FROM Usuarios WHERE idUsuario = ?;';
        let connection;
        try {
            connection = await createConnection();
            const [result] = await connection.query(query, [idUsuarioCreador]);
            return result[0].count > 0;
        } catch (error) {
            throw new Error("Error al verificar el idUsuarioCreador.");
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}