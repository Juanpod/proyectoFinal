import { Equipo } from "../models/mysql/equipoModel.js";

export class EquipoController {
    static async getAll(req, res, next) {
        try {
            const results = await Equipo.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idEquipo } = req.params;
        console.log(idEquipo);
        if (!idEquipo || isNaN(idEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido.",
            });
        }

        try {
            const result = await Equipo.getById(idEquipo);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idEquipo}.`,
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
            nombreEquipo,
            modeloEquipo,
            ipEquipo,
            idUsuario,
            idTipoEquipo,
        } = req.body;
        console.log(idUsuario, isNaN(idUsuario));
        console.log(idTipoEquipo, isNaN(idTipoEquipo));
        if (
            !nombreEquipo ||
            !modeloEquipo ||
            !idTipoEquipo ||
            isNaN(idTipoEquipo)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y deben ser válidos.",
            });
        }

        try {
            const newEquipo = await Equipo.create(
                nombreEquipo,
                modeloEquipo,
                ipEquipo,
                idUsuario,
                idTipoEquipo
            );

            res.status(201).json({
                success: true,
                data: newEquipo,
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idEquipo } = req.params;
        const {
            nombreEquipo,
            modeloEquipo,
            ipEquipo,
            idUsuario,
            idTipoEquipo,
        } = req.body;

        if (!idEquipo || isNaN(idEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido.",
            });
        }

        if (
            !nombreEquipo ||
            !modeloEquipo ||
            !idUsuario ||
            !idTipoEquipo ||
            isNaN(idEquipo) ||
            isNaN(idTipoEquipo)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y deben ser válidos.",
            });
        }

        try {
            const updatedEquipo = await Equipo.update(
                idEquipo,
                nombreEquipo,
                modeloEquipo,
                ipEquipo,
                idUsuario,
                idTipoEquipo
            );

            if (!updatedEquipo) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo actualizar, equipo con id=${idEquipo} no encontrado.`,
                });
            }

            res.status(200).json({
                success: true,
                message: "Equipo actualizado exitosamente.",
                data: updatedEquipo,
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idEquipo } = req.params;

        if (!idEquipo || isNaN(idEquipo)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const deletedId = await Equipo.delete(idEquipo);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el equipo para el id=${idEquipo}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Equipo con id ${idEquipo} eliminado exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
