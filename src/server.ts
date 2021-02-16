import express from "express";
import "./whatsapp";
import "./database/connect";

// app
const app = express();

// variables environments
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.info(`♨️  Servidor iniciado com sucesso na porta ${PORT}`)
})