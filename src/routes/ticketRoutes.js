import { Router } from "express";
import { TicketController } from "../controllers/ticketController.js";
import { authenticate } from "../middlewares/authenticate.js";
export const ticketRouter = Router();
ticketRouter.use(authenticate);

ticketRouter.get("/", TicketController.getAll);
ticketRouter.get("/:idTicket", TicketController.getById);
ticketRouter.post("/", TicketController.create);
ticketRouter.put("/:idTicket", TicketController.update);
ticketRouter.delete("/:idTicket", TicketController.delete);
