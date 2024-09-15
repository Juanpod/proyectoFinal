import { Router } from "express";
import { TipoEquipoController } from "../controllers/tipoEquipoController.js";
import { authenticate } from "../middlewares/authenticate.js";
export const tipoEquipoRouter = Router();
tipoEquipoRouter.use(authenticate);

tipoEquipoRouter.get("/", TipoEquipoController.getAll);
tipoEquipoRouter.get("/:idTipoEquipo", TipoEquipoController.getById);
tipoEquipoRouter.post("/", TipoEquipoController.create);
tipoEquipoRouter.put("/:idTipoEquipo", TipoEquipoController.update);
tipoEquipoRouter.delete("/:idTipoEquipo", TipoEquipoController.delete);
