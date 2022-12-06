import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

const server = app.listen(process.env.PORT || 3333, () => {
    if(server){
        const address = server.address()
        console.log(`Servidor rodando na porta ${address.port}.`)
    } else {
        console.log("Falha ao iniciar servidor.")
    }
})

export default app

