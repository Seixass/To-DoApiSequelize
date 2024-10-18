import { Router } from "express";
import { getAll, create, getTarefa, updateTarefa, updateStatusTarefa, buscarTarefaPorSituacao } from "../controllers/tarefasController.js";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getTarefa);
router.put("/:id", updateTarefa);
router.patch("/:id/status", updateStatusTarefa);
router.get("/status/:situacao", buscarTarefaPorSituacao);

export default router;
