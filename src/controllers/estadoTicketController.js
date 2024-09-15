import { EstadoTicket } from "../models/mysql/estadoTicketModel.js";

export class EstadoTicketController {
    static async getAll(req, res, next) {
        try {
            const results = await EstadoTicket.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idEstadoTicket } = req.params;

        if (!idEstadoTicket || isNaN(idEstadoTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const result = await EstadoTicket.getById(idEstadoTicket);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el estado para el id=${idEstadoTicket}.`,
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
        const { estadoTicket } = req.body;

        if (!estadoTicket || estadoTicket.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre del estado es obligatorio.",
            });
        }

        try {
            const newEntry = await EstadoTicket.create(estadoTicket);
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "El estado ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "El estado ya existe.",
                });
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idEstadoTicket } = req.params;
        const { estadoTicket } = req.body;

        if (!idEstadoTicket || isNaN(idEstadoTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        if (!estadoTicket || estadoTicket.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre del estado es obligatorio.",
            });
        }

        try {
            const updatedEntry = await EstadoTicket.update(
                idEstadoTicket,
                estadoTicket
            );

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el estado para el id=${idEstadoTicket}.`,
                });
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            });
        } catch (error) {
            if (error.message === "El estado ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "El estado ya existe.",
                });
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idEstadoTicket } = req.params;

        if (!idEstadoTicket || isNaN(idEstadoTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const deletedId = await EstadoTicket.delete(idEstadoTicket);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el estado para el id=${idEstadoTicket}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Estado con id ${idEstadoTicket} eliminado exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
