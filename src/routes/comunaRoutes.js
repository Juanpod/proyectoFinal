import { ComunaController } from "../controllers/comunaController.js";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

export const comunaRouter = Router();

comunaRouter.use(authenticate);

comunaRouter.get("/", ComunaController.getAll);
comunaRouter.get("/:idComuna", ComunaController.getById);
comunaRouter.post("/", ComunaController.create);
comunaRouter.put("/:idComuna", ComunaController.update);
comunaRouter.delete("/:idComuna", ComunaController.delete);
