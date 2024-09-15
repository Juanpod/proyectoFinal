import { Login } from "../models/mysql/loginModel.js";

export class LoginController {
    static async login(req, res, next) {
        console.log("Login Controller");
        const { email, password } = req.body;

        try {
            const result = await Login.login(email, password);

            if (result == null) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el email: ${email}.`,
                });
            }
            if (!result) {
                return res.status(403).json({
                    success: false,
                    message: `Contraseña incorrecta`,
                });
            }

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}
