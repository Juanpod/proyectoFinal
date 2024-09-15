import { SucursalController } from "../controllers/sucursalController.js";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

export const sucursalRouter = Router();
sucursalRouter.use(authenticate);

sucursalRouter.get("/", SucursalController.getAll);
sucursalRouter.get("/:idSucursal", SucursalController.getById);
sucursalRouter.post("/", SucursalController.create);
sucursalRouter.put("/:idSucursal", SucursalController.update);
sucursalRouter.delete("/:idSucursal", SucursalController.delete);
