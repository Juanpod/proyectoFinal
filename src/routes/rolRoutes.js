import { Router } from 'express'
import { RolController } from '../controllers/rolController.js'

export const rolRouter = Router()

rolRouter.get('/', RolController.getAll)
rolRouter.get('/:idRol', RolController.getById)
rolRouter.post('/', RolController.create)
rolRouter.put('/:idRol', RolController.update)
rolRouter.delete('/:idRol', RolController.delete)

