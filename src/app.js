import express from "express";
import cors from "cors";
import { FRONTED_URL } from "./config/config.js";

const app = express();
app.disable("x-powered-by");

// Middleware para procesar JSON
app.use(express.json());
const corsOptions = {
    credentials: true,
    origin: [FRONTED_URL],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;
