import { ComentarioController } from "../controllers/comentarioController.js";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

export const comentarioRouter = Router();

comentarioRouter.use(authenticate);

comentarioRouter.get("/", ComentarioController.getAll);
comentarioRouter.get("/:idComentario", ComentarioController.getById);
comentarioRouter.post("/", ComentarioController.create);
comentarioRouter.put("/:idComentario", ComentarioController.update);
comentarioRouter.delete("/:idComentario", ComentarioController.delete);
