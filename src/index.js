import app from "./app.js"
import { rolRouter } from "./routes/rolRoutes.js"
import { tipoEquipoRouter } from "./routes/tipoEquipoRoutes.js"
import { comunaRouter } from "./routes/comunaRoutes.js"
import { tipoComentarioRouter } from "./routes/tipoComentarioRoutes.js"
import { categoriaRouter } from "./routes/categoriaRoutes.js"
import { prioridadRouter } from "./routes/prioridadRoutes.js"
import { estadoTicketRouter } from "./routes/estadoTicketRoutes.js"
import { sucursalRouter } from "./routes/sucursalRoutes.js"
import { usuarioRouter } from "./routes/usuarioRoutes.js"
import { equipoRouter } from "./routes/equipoRoutes.js"
import { ticketRouter } from "./routes/ticketRoutes.js"
import { comentarioRouter } from "./routes/comentarioRoutes.js"



//Rutas
app.use('/rol', rolRouter)
app.use('/tiposEquipos', tipoEquipoRouter)
app.use('/comuna', comunaRouter)
app.use('/tipoComentario', tipoComentarioRouter)
app.use('/categoria', categoriaRouter)
app.use('/prioridad', prioridadRouter)
app.use('/estadoTicket', estadoTicketRouter)
app.use('/sucursal', sucursalRouter)
app.use('/usuario', usuarioRouter)
app.use('/equipo', equipoRouter)
app.use('/ticket', ticketRouter)
app.use('/comentario', comentarioRouter)








app.use((err, req, res, next) => {
  console.error(err.message); // Log del error en el servidor
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
    
  });
});

app.use((req, res) => {
  res.status(404).send('<h1>404 Not found</h1>')
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

