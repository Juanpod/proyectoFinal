import { TipoComentario } from "../models/mysql/tipoComentarioModel.js"

export class TipoComentarioController {
    static async getAll(req, res, next) {
        try {
            const results = await TipoComentario.getAll()
            res.status(200).json({
                success: true,
                data: results
            })
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next) {
        const { idTipoComentario } = req.params

        if (!idTipoComentario || isNaN(idTipoComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido."
            })
        }

        try {
            const result = await TipoComentario.getById(idTipoComentario)

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el tipo de comentario para el id=${idTipoComentario}.`
                });
            }

            res.status(200).json({
                success: true,
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async create(req, res, next) {
        const { tipoComentario } = req.body

        if (!tipoComentario || tipoComentario.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El tipo de comentario es obligatorio."
            })
        }

        try {
            const newEntry = await TipoComentario.create(tipoComentario)
            res.status(201).json({
                success: true,
                data: newEntry
            })
        } catch (error) {
            if (error.message === "El tipo de comentario ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "El tipo de comentario ya existe."
                })
            }
            next(error)
        }
    }

    static async update(req, res, next) {
        const { idTipoComentario } = req.params
        const { tipoComentario } = req.body

        if (!idTipoComentario || isNaN(idTipoComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido."
            })
        }

        if (!tipoComentario || tipoComentario.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El tipo de comentario es obligatorio."
            })
        }

        try {
            const updatedEntry = await TipoComentario.update(idTipoComentario, tipoComentario)

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el tipo de comentario para el id=${idTipoComentario}.`,
                })
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            })
        } catch (error) {
            if (error.message === "El tipo de comentario ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "El tipo de comentario ya existe."
                })
            }
            next(error)
        }
    }

    static async delete(req, res, next) {
        const { idTipoComentario } = req.params

        if (!idTipoComentario || isNaN(idTipoComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido."
            })
        }

        try {
            const deletedId = await TipoComentario.delete(idTipoComentario)

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el tipo de comentario para el id=${idTipoComentario}.`,
                })
            }

            res.status(200).json({
                success: true,
                message: `Tipo de comentario con id ${idTipoComentario} eliminado exitosamente.`,
            })
        } catch (error) {
            next(error)
        }
    }
}