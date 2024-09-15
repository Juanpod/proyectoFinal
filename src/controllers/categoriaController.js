import { Categoria } from "../models/mysql/categoriaModel.js";

export class CategoriaController {
    static async getAll(req, res, next) {
        try {
            const results = await Categoria.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idCategoria } = req.params;

        if (!idCategoria || isNaN(idCategoria)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const result = await Categoria.getById(idCategoria);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la categoría para el id=${idCategoria}.`,
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
        const { nombreCategoria } = req.body;

        if (!nombreCategoria || nombreCategoria.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la categoría es obligatorio.",
            });
        }

        try {
            const newEntry = await Categoria.create(nombreCategoria);
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "La categoría ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "La categoría ya existe.",
                });
            }
            next(error);
        }
    }

    static async update(req, res, next) {
        const { idCategoria } = req.params;
        const { nombreCategoria } = req.body;

        if (!idCategoria || isNaN(idCategoria)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        if (!nombreCategoria || nombreCategoria.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "El nombre de la categoría es obligatorio.",
            });
        }

        try {
            const updatedEntry = await Categoria.update(
                idCategoria,
                nombreCategoria
            );

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la categoría para el id=${idCategoria}.`,
                });
            }

            res.status(200).json({
                success: true,
                data: updatedEntry,
            });
        } catch (error) {
            if (error.message === "La categoría ya existe.") {
                return res.status(409).json({
                    success: false,
                    message: "La categoría ya existe.",
                });
            }
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idCategoria } = req.params;

        if (!idCategoria || isNaN(idCategoria)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            const deletedId = await Categoria.delete(idCategoria);

            if (!deletedId) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró la categoría para el id=${idCategoria}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `Categoría con id ${idCategoria} eliminada exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
