import { Router } from "express";
import { EquipoController } from "../controllers/equipoController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const equipoRouter = Router();
equipoRouter.use(authenticate);

equipoRouter.get("/", EquipoController.getAll);
equipoRouter.get("/:idEquipo", EquipoController.getById);
equipoRouter.post("/", EquipoController.create);
equipoRouter.put("/:idEquipo", EquipoController.update);
equipoRouter.delete("/:idEquipo", EquipoController.delete);
