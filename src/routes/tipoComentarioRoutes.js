import { Router } from "express";
import { TipoComentarioController } from "../controllers/tipoComentarioController.js";
import { authenticate } from "../middlewares/authenticate.js";

export const tipoComentarioRouter = Router();
tipoComentarioRouter.use(authenticate);

tipoComentarioRouter.get("/", TipoComentarioController.getAll);
tipoComentarioRouter.get(
    "/:idTipoComentario",
    TipoComentarioController.getById
);
tipoComentarioRouter.post("/", TipoComentarioController.create);
tipoComentarioRouter.put("/:idTipoComentario", TipoComentarioController.update);
tipoComentarioRouter.delete(
    "/:idTipoComentario",
    TipoComentarioController.delete
);
