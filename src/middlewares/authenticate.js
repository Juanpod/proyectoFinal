import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    console.log("Authenticate, Token: ", token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Se requiere autorizacion",
        });
    }

    try {
        const decoded = jwt.verify(token, "secreta");
        console.log("Autenthicate, decoded:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Autenthicate: Token Invalido",
        });
    }
};
