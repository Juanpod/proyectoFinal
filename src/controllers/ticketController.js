import { Ticket } from "../models/mysql/ticketModel.js";

export class TicketController {
    static async getAll(req, res, next) {
        try {
            const tickets = await Ticket.getAll();
            res.status(200).json({
                succes: true,
                data: tickets,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idTicket } = req.params;

        if (!idTicket || isNaN(idTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido.",
            });
        }

        try {
            const result = await Ticket.getById(idTicket);
            console.log(result);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idTicket}.`,
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
        const {
            asuntoTicket,
            descripcionTicket,
            idEstadoTicket,
            idPrioridad,
            idCategoria,
            idUsuarioCreador,
            idUsuarioResolutor,
        } = req.body;

        if (
            !asuntoTicket ||
            !descripcionTicket ||
            !idEstadoTicket ||
            !idPrioridad ||
            !idCategoria ||
            !idUsuarioCreador ||
            isNaN(idPrioridad) ||
            isNaN(idCategoria) ||
            isNaN(idUsuarioCreador)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y deben ser válidos.",
            });
        }

        try {
            const newTicket = await Ticket.create(
                asuntoTicket,
                descripcionTicket,
                idEstadoTicket,
                idPrioridad,
                idCategoria,
                idUsuarioCreador,
                idUsuarioResolutor
            );

            res.status(201).json({
                success: true,
                data: newTicket,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idTicket } = req.params;
        const {
            asuntoTicket,
            descripcionTicket,
            idEstadoTicket,
            idPrioridad,
            idCategoria,
            idUsuarioResolutor,
        } = req.body;

        if (!idTicket || isNaN(idTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido.",
            });
        }

        if (
            !asuntoTicket ||
            !descripcionTicket ||
            !idEstadoTicket ||
            !idPrioridad ||
            !idCategoria ||
            isNaN(idPrioridad) ||
            isNaN(idCategoria)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y deben ser válidos.",
            });
        }

        try {
            const updatedTicket = await Ticket.update(
                idTicket,
                asuntoTicket,
                descripcionTicket,
                idEstadoTicket,
                idPrioridad,
                idCategoria,
                idUsuarioResolutor
            );

            if (!updatedTicket) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo actualizar, ticket con id=${idTicket} no encontrado.`,
                });
            }

            res.status(200).json({
                success: true,
                message: "Ticket actualizado exitosamente.",
                data: updatedTicket,
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idTicket } = req.params;

        if (!idTicket || isNaN(idTicket)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido.",
            });
        }

        try {
            const deletedTicket = await Ticket.delete(idTicket);

            if (!deletedTicket) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo eliminar, ticket con id=${idTicket} no encontrado.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Ticket con id=${idTicket} eliminado exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
