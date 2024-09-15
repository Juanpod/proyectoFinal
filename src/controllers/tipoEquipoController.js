import { TipoEquipo } from "../models/mysql/tipoEquipoModel.js";

export class TipoEquipoController {
    static async getAll(req, res, next) {
        try {
            console.log(
                "Controller: Ejecutando metodo getAll para TiposEquipos"
            );
            const results = await TipoEquipo.getAll();
            res.status(200).json({
                succes: true,
                data: results,
            });
            console.log("Controller: Datos obtenidos exitosamente");
        } catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        const { idTipoEquipo } = req.params;

        if (!idTipoEquipo || isNaN(idTipoEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID de tipo de equipo es inválido.",
            });
        } // Validación del parámetro

        try {
            console.log(
                `Controller: Ejecutando metodo getById para Tipo de equipo y id ${idTipoEquipo} `
            );

            const result = await TipoEquipo.getById(idTipoEquipo);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idTipoEquipo}.`,
                });
            }

            res.status(200).json({
                success: true,
                data: result,
            });
            console.log(
                `Controller: Dato con id ${idTipoEquipo} obtenido exitosamente.`
            );
        } catch (error) {
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
    static async create(req, res, next) {
        const { tipoEquipo } = req.body;

        if (!tipoEquipo || tipoEquipo.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre del tipo de equipo es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando el metodo create para crear el tipo de equipo ${tipoEquipo}`
            );
            const newEntry = await TipoEquipo.create(tipoEquipo);
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "El nombre ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El tipo de equipo ya existe. Por favor elige otro.",
                });
            }
            next(error);
        }
    }
    static async update(req, res, next) {
        const { idTipoEquipo } = req.params;
        const { tipoEquipo } = req.body;

        if (!idTipoEquipo || isNaN(idTipoEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }
        if (!tipoEquipo || tipoEquipo.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutanto metodo update para el id=${idTipoEquipo} y tipo de equipo=${tipoEquipo}`
            );

            const updatedEntry = await TipoEquipo.update(
                idTipoEquipo,
                tipoEquipo
            ); // Actualizar el rol con el método del modelo

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el dato para el id=${idTipoEquipo}`,
                });
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            });

            console.log(
                "Controller: El resultado del update es:",
                updatedEntry
            );
        } catch (error) {
            if (error.message === "El nombre ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El nombre de tipo de equipo ya existe. Por favor elige otro.",
                });
            }
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
    static async delete(req, res, next) {
        const { idTipoEquipo } = req.params;

        if (!idTipoEquipo || isNaN(idTipoEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando el metodo delete para Tipo de Equipos y id=${idTipoEquipo}`
            );

            const deletedId = await TipoEquipo.delete(idTipoEquipo);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el tdato para el id=${idTipoEquipo}`,
                });
            }
            res.status(200).json({
                success: true,
                data: deletedId,
            });
            console.log("Controller: Eliminado");
        } catch (error) {
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
}
