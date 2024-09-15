import { CategoriaController } from "../controllers/categoriaController.js";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

export const categoriaRouter = Router();
categoriaRouter.use(authenticate);

categoriaRouter.get("/", CategoriaController.getAll);
categoriaRouter.get("/:idCategoria", CategoriaController.getById);
categoriaRouter.post("/", CategoriaController.create);
categoriaRouter.put("/:idCategoria", CategoriaController.update);
categoriaRouter.delete("/:idCategoria", CategoriaController.delete);
