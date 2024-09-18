import { createConnection } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class Login {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static async login(email, password) {
        const query =
            "SELECT idUsuario, nombre, idRol, password FROM Usuarios WHERE email = ?";
        console.log("Model:", email);
        let connection;
        try {
            connection = await createConnection();
            const [results] = await connection.query(query, [email]);

            if (results.length === 0) {
                console.log("El correo no existe");
                return null;
            }

            const isValidPassword = await bcrypt.compare(
                password,
                results[0].password
            );

            console.log(isValidPassword);
            console.log(results[0]);
            console.table(results[0]);

            if (isValidPassword) {
                const token = jwt.sign(
                    {
                        idUsuario: results[0].idUsuario,
                        nombre: results[0].nombre,
                        idRol: results[0].idRol,
                    },
                    "secreta",
                    {
                        expiresIn: 60 * 60,
                    }
                );

                return {
                    token,
                    idUsuario: results[0].idUsuario,
                    idRol: results[0].idRol,
                };
            }

            return isValidPassword;
        } catch (error) {
            console.error("Error al obtener datos");
            throw new Error("Error en la base de datos al obtener los datos.");
        } finally {
            if (connection) {
                connection.end();
                console.log("Model: Conexion cerrada");
            }
        }
    }
}
