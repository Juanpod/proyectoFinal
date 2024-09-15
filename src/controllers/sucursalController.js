import { Sucursal } from "../models/mysql/sucursalModel.js";

export class SucursalController {
    static async getAll(req, res, next) {
        try {
            const results = await Sucursal.getAll();
            res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        const { idSucursal } = req.params;

        if (!idSucursal || isNaN(idSucursal)) {
            return res.status(400).json({
                success: false,
                message: "El ID de no es inválido.",
            });
        } // Validación del parámetro

        try {
            console.log(
                `Controller: Ejecutando método getById para Sucursal y id ${idSucursal}`
            );
            const result = await Sucursal.getById(idSucursal);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idSucursal}.`,
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
        const { nombreSucursal, direccionSucursal, idComuna } = req.body;

        if (
            !nombreSucursal ||
            !direccionSucursal ||
            !idComuna ||
            isNaN(idComuna)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y idComuna debe ser un número válido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando método create para crear la sucursal ${nombreSucursal}`
            );
            const newEntry = await Sucursal.create(
                nombreSucursal,
                direccionSucursal,
                idComuna
            );
            res.status(201).json({
                success: true,
                data: newEntry,
            });
        } catch (error) {
            if (error.message === "El nombre ya existe.") {
                return res.status(409).json({
                    success: false,
                    message:
                        "El nombre de la sucursal ya existe. Por favor elige otro nombre.",
                });
            }
            if (error.message === "El idComuna no es válido.") {
                return res.status(400).json({
                    success: false,
                    message:
                        "El idComuna proporcionado no existe en la base de datos.",
                });
            }
            next(error);
        }
    }
    static async update(req, res, next) {
        const { idSucursal } = req.params;
        const { nombreSucursal, direccionSucursal, idComuna } = req.body;

        // Validar que los datos obligatorios están presentes y que idComuna es un número
        if (
            !nombreSucursal ||
            !direccionSucursal ||
            !idComuna ||
            isNaN(idComuna)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Todos los campos son obligatorios y el idComuna debe ser un número válido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando método update para la sucursal con id ${idSucursal}`
            );

            // Llamar al método update del modelo
            const updatedEntry = await Sucursal.update(
                idSucursal,
                nombreSucursal,
                direccionSucursal,
                idComuna
            );

            if (!updatedEntry) {
                return res.status(404).json({
                    success: false,
                    message:
                        "No se encontró una sucursal con el id proporcionado.",
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
                        "El nombre de la sucursal ya existe para otro registro. Por favor, elige otro nombre.",
                });
            }
            if (error.message === "El idComuna no es válido.") {
                return res.status(400).json({
                    success: false,
                    message:
                        "El idComuna proporcionado no existe en la base de datos.",
                });
            }
            next(error);
        }
    }
    static async delete(req, res, next) {
        const { idSucursal } = req.params;

        if (!idSucursal || isNaN(idSucursal)) {
            return res.status(400).json({
                success: false,
                message: "El ID es inválido.",
            });
        }

        try {
            console.log(
                `Controller: Ejecutando método delete para el id=${idSucursal}`
            );
            const deletedEntry = await Sucursal.delete(idSucursal);

            if (!deletedEntry) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontró el dato para el id=${idSucursal}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: `La sucursal con id=${idSucursal} ha sido eliminada exitosamente.`,
            });
        } catch (error) {
            next(error);
        }
    }
}
