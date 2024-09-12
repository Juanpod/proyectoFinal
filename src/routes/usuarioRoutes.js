import { Router } from 'express'
import { UsuarioController } from '../controllers/usuarioController.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', UsuarioController.getAll)
usuarioRouter.get('/:idUsuario', UsuarioController.getById)
usuarioRouter.post('/', UsuarioController.create)
usuarioRouter.put('/:idUsuario', UsuarioController.update)
usuarioRouter.delete('/:idUsuario', UsuarioController.delete)
