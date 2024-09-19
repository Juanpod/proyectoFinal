import mysql from "mysql2/promise";
import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from "./config.js";

const config = {
    host: DB_HOST,
    user: DB_USER,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_DATABASE,
};

export const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(config);
        console.log("Mysql: Conexion a la base de datos creada");
        return connection;
    } catch (error) {
        console.error("Mysql: Error al conectar con la base de datos");
        throw error;
    }
};
