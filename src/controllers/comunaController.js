import { Comuna } from "../models/mysql/comunaModel.js";

export class ComunaController {
    static async getAll(req, res, next) {
        try {
            console.log("Controller: Ejecutando metodo getAll para Comunas");
            const results = await Comuna.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idComuna } = req.params;

        if (!idComuna || isNaN(idComuna)) {
            return res.status(400).json({
                success: false,
                message: "El ID de la comuna es inválido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando metodo getById para Comuna y id ${idComuna}`
            );
            const result = await Comuna.getById(idComuna);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idComuna}.`,
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
        const { nombreComuna } = req.body;

        if (!nombreComuna || nombreComuna.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la comuna es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando metodo create para crear la comuna ${nombreComuna}`
            );
            const newEntry = await Comuna.create(nombreComuna);
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "El nombre ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "La comuna ya existe. Por favor elige otro nombre.",
                });
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idComuna } = req.params;
        const { nombreComuna } = req.body;

        if (!idComuna || isNaN(idComuna)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }
        if (!nombreComuna || nombreComuna.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la comuna es obligatorio.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando metodo update para el id=${idComuna} y nombreComuna=${nombreComuna}`
            );

            const updatedEntry = await Comuna.update(idComuna, nombreComuna);

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el dato para el id=${idComuna}.`,
                });
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            });
        } catch (error) {
            if (error.message === "El nombre ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El nombre de la comuna ya existe. Por favor elige otro nombre.",
                });
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idComuna } = req.params;

        if (!idComuna || isNaN(idComuna)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando metodo delete para el id=${idComuna}`
            );

            const deletedId = await Comuna.delete(idComuna);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el dato para el id=${idComuna}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Comuna con id ${idComuna} eliminada exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
