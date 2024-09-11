import express from 'express'

const app = express()
app.disable('x-powered-by')

// Middleware para procesar JSON
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})


export default app