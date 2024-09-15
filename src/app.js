import express from "express";
import cors from "cors";

const app = express();
app.disable("x-powered-by");

// Middleware para procesar JSON
app.use(express.json());
const corsOptions = {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;
