import { Prioridad } from "../models/mysql/prioridadModel.js";

export class PrioridadController {
    static async getAll(req, res, next) {
        try {
            const results = await Prioridad.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idPrioridad } = req.params;

        if (!idPrioridad || isNaN(idPrioridad)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const result = await Prioridad.getById(idPrioridad);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la prioridad para el id=${idPrioridad}.`,
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

    static async create(req, res, next) {
        const { nombrePrioridad } = req.body;

        if (!nombrePrioridad || nombrePrioridad.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la prioridad es obligatorio.",
            });
        }

        try {
            const newEntry = await Prioridad.create(nombrePrioridad);
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "La prioridad ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "La prioridad ya existe.",
                });
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idPrioridad } = req.params;
        const { nombrePrioridad } = req.body;

        if (!idPrioridad || isNaN(idPrioridad)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        if (!nombrePrioridad || nombrePrioridad.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la prioridad es obligatorio.",
            });
        }

        try {
            const updatedEntry = await Prioridad.update(
                idPrioridad,
                nombrePrioridad
            );

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la prioridad para el id=${idPrioridad}.`,
                });
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            });
        } catch (error) {
            if (error.message === "La prioridad ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "La prioridad ya existe.",
                });
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idPrioridad } = req.params;

        if (!idPrioridad || isNaN(idPrioridad)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const deletedId = await Prioridad.delete(idPrioridad);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la prioridad para el id=${idPrioridad}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Prioridad con id ${idPrioridad} eliminada exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
