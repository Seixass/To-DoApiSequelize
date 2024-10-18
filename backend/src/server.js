import "dotenv/config";
import express from "express";
import cors from "cors";
import conn from "./config/conn.js";

//importação dos models
import Tarefa from "./models/tarefaModel.js";

//importação das rotas
import tarefaRouter from "./routes/tarefaRouter.js"

const PORT = process.env.PORT || 9090;

const app = express();

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//conexão com o banco
conn
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error(error));

//utilizar rotas
app.use("/tarefas", tarefaRouter);

app.use((req, res) => {
  res.status(404).json({ msg: "Rota não encontrada" });
});
