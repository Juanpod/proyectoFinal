import { EstadoTicketController } from "../controllers/estadoTicketController.js";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";

export const estadoTicketRouter = Router();

estadoTicketRouter.use(authenticate);

estadoTicketRouter.get("/", EstadoTicketController.getAll);
estadoTicketRouter.get("/:idEstadoTicket", EstadoTicketController.getById);
estadoTicketRouter.post("/", EstadoTicketController.create);
estadoTicketRouter.put("/:idEstadoTicket", EstadoTicketController.update);
estadoTicketRouter.delete("/:idEstadoTicket", EstadoTicketController.delete);
