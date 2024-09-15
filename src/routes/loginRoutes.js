import { LoginController } from "../controllers/loginController.js";
import { Router } from "express";

export const loginRouter = Router();

loginRouter.post("/", LoginController.login);
