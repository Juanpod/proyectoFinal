import { Rol } from "../models/mysql/rolModel.js";

export class RolController {
    static async getAll(req, res, next) {
        try {
            console.log("Controller: Ejecutando metodo getAll para Roles");
            const roles = await Rol.getAll();
            res.status(200).json({
                success: true,
                data: roles,
            });
            console.log("Controller: Roles obtenidos exitosamente");
        } catch (error) {
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
    static async getById(req, res, next) {
        const { idRol } = req.params;

        if (!idRol || isNaN(idRol)) {
            return res.status(400).json({
                success: false,
                message: "El ID de rol es inválido.",
            });
        } // Validación del parámetro

        try {
            console.log(
                `Controller: Ejecutando metodo getRolById para idRol ${idRol} `
            );

            const rol = await Rol.getById(idRol);

            if (!rol) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el rol con idRol=${idRol}.`,
                });
            } // Si no se encontró el id, se envia respuesta apropiada al cliente.

            res.status(200).json({
                success: true,
                data: rol,
            });
            console.log(
                `Controller: Rol con idRol ${idRol} obtenido exitosamente.`
            );
        } catch (error) {
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }

    static async create(req, res, next) {
        const { nombreRol } = req.body;
        // Validación de entrada
        if (!nombreRol || nombreRol.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre del rol es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando el metodo createRol para crear el rol ${nombreRol}`
            );

            const rol = await Rol.create(nombreRol);
            res.status(201).json({
                success: true,
                data: rol,
            });
            console.log("Controller: Rol creado exitosamente");
        } catch (error) {
            if (error.message === "El nombre del rol ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El nombre del rol ya existe. Por favor elige otro.",
                });
            }
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }

    static async update(req, res, next) {
        // Extraer idRol de los parámetros de la URL y nombreRol del cuerpo de la solicitud
        const { idRol } = req.params;
        const { nombreRol } = req.body;

        if (!idRol || isNaN(idRol)) {
            return res.status(400).json({
                success: false,
                message: "El ID de rol es inválido.",
            });
        }
        if (!nombreRol || nombreRol.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre del rol es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutanto metodo updateRol con idRol=${idRol} y nombreRol=${nombreRol}`
            );

            const updatedRol = await Rol.update(idRol, nombreRol); // Actualizar el rol con el método del modelo

            if (!updatedRol) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el rol con idRol=${idRol}`,
                });
            } // Verificar si el rol se actualizó correctamente

            res.status(200).json({
                success: true,
                data: updatedRol,
            }); // Enviar respuesta exitosa con el rol actualizado

            console.log("Controller: El resultado del update es:", updatedRol);
        } catch (error) {
            if (error.message === "El nombre de rol ya existe para otro rol.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El nombre de rol ya existe para otro rol. Por favor elige otro.",
                });
            }
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }

    static async delete(req, res, next) {
        const { idRol } = req.params;

        if (!idRol || isNaN(idRol)) {
            return res.status(400).json({
                success: false,
                message: "El ID de rol es inválido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando el metodo deleteRol para idRol=${idRol}`
            );

            const deletedRol = await Rol.delete(idRol);

            if (!deletedRol) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el rol con idRol=${idRol}`,
                });
            }
            res.status(200).json({
                success: true,
                data: deletedRol,
            });
            console.log("Controller: Rol eliminado");
        } catch (error) {
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
}
