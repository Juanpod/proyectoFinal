import { CategoriaController } from "../controllers/categoriaController.js";
import { Router } from "express";

export const categoriaRouter = Router();

categoriaRouter.get("/", CategoriaController.getAll);
categoriaRouter.get("/:idCategoria", CategoriaController.getById);
categoriaRouter.post("/", CategoriaController.create);
categoriaRouter.put("/:idCategoria", CategoriaController.update);
categoriaRouter.delete("/:idCategoria", CategoriaController.delete);
