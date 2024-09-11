import { Router } from 'express'
import { TipoEquipoController } from '../controllers/tipoEquipoController.js'

export const tipoEquipoRouter = Router()

tipoEquipoRouter.get('/', TipoEquipoController.getAll)
tipoEquipoRouter.get('/:idTipoEquipo', TipoEquipoController.getById)
tipoEquipoRouter.post('/', TipoEquipoController.create)
tipoEquipoRouter.put('/:idTipoEquipo', TipoEquipoController.update)
tipoEquipoRouter.delete('/:idTipoEquipo', TipoEquipoController.delete)

