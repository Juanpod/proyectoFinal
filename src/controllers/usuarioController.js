import { Usuario } from "../models/mysql/usuarioModel.js";
import bcrypt from 'bcrypt'

export class UsuarioController {
    static async getAll(req, res, next) {
        try {
            const results = await Usuario.getAll();
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        const { idUsuario } = req.params;

        
        if (!idUsuario || isNaN(idUsuario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            })
        }

        try {
            const result = await Usuario.getById(idUsuario);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idUsuario}.`
                });
            }

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        const { nombre, email, password, rut, idRol, idSucursal, telefonoContacto } = req.body;

        if (!nombre || !email || !password || !rut || !idRol || !idSucursal || isNaN(idRol) || isNaN(idSucursal)) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios y deben ser válidos."
            });
        }
        
        
        
        try {
            
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            
            const newUser = await Usuario.create(nombre, email, hashedPassword, rut, idRol, idSucursal, telefonoContacto)
        
            res.status(201).json({
                success: true,
                data: newUser
            })
        } catch (error) {
            next(error)
        }
    }
    
    static async update(req, res, next) {
        const { idUsuario } = req.params;
        const { nombre, email, password, rut, idRol, idSucursal, telefonoContacto } = req.body;

        if (!idUsuario || isNaN(idUsuario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            });
        }

        if (!nombre || !email || !rut || !idRol || !idSucursal || isNaN(idRol) || isNaN(idSucursal)) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios y deben ser válidos."
            });
        }

        try {
            const updatedUser = await Usuario.update(idUsuario, nombre, email, password, rut, idRol, idSucursal, telefonoContacto);

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo actualizar, usuario con id=${idUsuario} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                message: "Usuario actualizado exitosamente.",
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        const { idUsuario } = req.params;

        if (!idUsuario || isNaN(idUsuario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            });
        }

        try {
            const deletedUser = await Usuario.delete(idUsuario);

            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo eliminar, usuario con id=${idUsuario} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                message: `Usuario con id=${idUsuario} eliminado exitosamente.`
            });
        } catch (error) {
            next(error);
        }
    }
}
