import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'helpdesk'
}

export const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(config)
        console.log("Mysql: Conexion a la base de datos creada")
        return connection
    } catch (error) {
        console.error('Mysql: Error al conectar con la base de datos')
        throw error
    }
}
