import { ComunaController } from "../controllers/comunaController.js";
import { Router } from "express";

export const comunaRouter = Router();

comunaRouter.get("/", ComunaController.getAll);
comunaRouter.get("/:idComuna", ComunaController.getById);
comunaRouter.post("/", ComunaController.create);
comunaRouter.put("/:idComuna", ComunaController.update);
comunaRouter.delete("/:idComuna", ComunaController.delete);
