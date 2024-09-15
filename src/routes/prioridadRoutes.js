import { PrioridadController } from "../controllers/prioridadController.js";
import { Router } from "express";

export const prioridadRouter = Router();

prioridadRouter.get("/", PrioridadController.getAll);
prioridadRouter.get("/:idPrioridad", PrioridadController.getById);
prioridadRouter.post("/", PrioridadController.create);
prioridadRouter.put("/:idPrioridad", PrioridadController.update);
prioridadRouter.delete("/:idPrioridad", PrioridadController.delete);
