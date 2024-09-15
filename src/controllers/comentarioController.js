import { Comentario } from "../models/mysql/comentarioModel.js";


export class ComentarioController{
    static async getAll(req, res, next){
        try {
            const comentarios = await Comentario.getAll();
            res.status(200).json({
                succes: true,
                data: comentarios
            })
        } catch (error) {
            next(error)
        }
    }

    static async getById(req, res, next){
        const { idComentario } = req.params;

        if (!idComentario || isNaN(idComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            });
        }

        try {
            const result = await Comentario.getById(idComentario);
            console.log(result)
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `No se encontraron datos para el id=${idComentario}.`
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
    static async create(req, res, next){
        const { comentario, idTipoComentario, idTicket } = req.body;

        if (!comentario || !idTipoComentario || !idTicket || isNaN(idTipoComentario) || isNaN(idTicket)) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios y deben ser válidos."
            });
        }

        try {
      
            const newComment = await Comentario.create(comentario, idTipoComentario, idTicket);
        
            res.status(201).json({
                success: true,
                data: newComment
            });
        } catch (error) {
            next(error);
        }
    }
    static async update(req, res, next){
        const { idComentario } = req.params;
        const { comentario, idTipoComentario, idTicket} = req.body;

        if (!idComentario || isNaN(idComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            });
        }

        if (!comentario || !idTipoComentario || !idTicket || isNaN(idTipoComentario) || isNaN(idTicket)) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios y deben ser válidos."
            });
        }

        try {
            const updatedComment = await Comentario.update(idComentario, comentario, idTipoComentario, idTicket);

            if (!updatedComment) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo actualizar, comentario con id=${idComentario} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                message: "Comentario actualizado exitosamente.",
                data: updatedComment
            });
        } catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next){
        const { idComentario } = req.params;

        if (!idComentario || isNaN(idComentario)) {
            return res.status(400).json({
                success: false,
                message: "El ID proporcionado no es válido."
            });
        }

        try {
            const deletedComment = await Comentario.delete(idComentario);

            if (!deletedComment) {
                return res.status(404).json({
                    success: false,
                    message: `No se pudo eliminar, ticket con id=${idComentario} no encontrado.`
                });
            }

            res.status(200).json({
                success: true,
                message: `Comentario con id=${idComentario} eliminado exitosamente.`
            });
        } catch (error) {
            next(error);
        }
    }
}