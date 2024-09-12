
import { Router } from "express"
import { EquipoController } from "../controllers/equipoController.js"

export const equipoRouter = Router()

equipoRouter.get('/', EquipoController.getAll)
equipoRouter.get('/:idEquipo', EquipoController.getById)
equipoRouter.post('/', EquipoController.create)
equipoRouter.put('/:idEquipo', EquipoController.update)
equipoRouter.delete('/:idEquipo', EquipoController.delete)