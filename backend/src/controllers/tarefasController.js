import Tarefa from "../models/tarefaModel.js";
import { z } from "zod";
import formatZodError from "../helpers/zodError.js";

//Validações com ZOD
const createSchema = z.object({
  tarefa: z.string().min(3, {msg: "A tarefa deve ter pelo menos 3 caracteres"}).transform((txt) =>txt.toLowerCase()),
  descricao: z.string().min(10, {msg: "A descricao deve ter pelo menos 10 caracteres"}),
})

const idSchema = z.object({
  id: z.string().uuid("ID inválido. Deve ser um UUID válido."),
});

const updateSchema = z.object({
  tarefa: z.string().min(1, "A tarefa é obrigatória"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  status: z.enum(["pendente", "concluída"], "O status é obrigatório e deve ser 'pendente' ou 'concluída'"),
});

//tarefas?page=2&limit=10
export const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const tarefas = await Tarefa.findAndCountAll({
      limit,
      offset,
    });

    const totalPaginas = Math.ceil(tarefas.count / limit);
    res.status(200).json({
      totalTarefas: tarefas.count,
      totalPaginas,
      paginaAtual: page,
      itensPorPagina: limit,
      proximaPagina:
        totalPaginas === 0
          ? null
          : `http://localhost:3333/tarefas?page=${page + 1}`,
      tarefas: tarefas.rows,
    });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao listar tarefas" });
  }
};

export const create = async (req, res) => {

  //implementando a validação com zod
  const bodyValidation = createSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ 
      msg: "Os dados recebidos do corpo da requisição são inválidos", 
      detalhes: formatZodError(bodyValidation.error) 
    });
  }

  const { tarefa, descricao } = req.body;
  const status = "pendente";


  const novaTarefa = {
    tarefa,
    descricao,
    status,
  };
  try {
    await Tarefa.create(novaTarefa);
    res.status(201).json({ mes: "Tarefa Cadastrada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ meg: "Erro ao cadastrar tarefa" });
  }
};

export const getTarefa = async (req, res) => {

  // Validação do ID com Zod
  const paramValidation = idSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ 
      msg: "ID da tarefa inválido", 
      detalhes: formatZodError(paramValidation.error) 
    });
  }

  const { id } = req.params;

  try {
    const tarefa = await Tarefa.findOne({ where: { id } });
    if (!tarefa) {
      return res.status(404).json({ msg: "Tarefa não encontrada" });
    }
    res.status(200).json(tarefa);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar tarefa" });
  }
};

export const updateTarefa = async (req, res) => {

  const paramValidation = idSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ 
      msg: "ID da tarefa inválido", 
      detalhes: formatZodError(paramValidation.error) 
    });
  }

  const bodyValidation = updateSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ 
      msg: "Os dados recebidos do corpo da requisição são inválidos", 
      detalhes: formatZodError(bodyValidation.error) 
    });
  }

  const { id } = req.params;
  const { tarefa, descricao, status } = req.body;

  // Validações
  if (!tarefa) {
      res.status(400).json({ msg: "A tarefa é obrigatória" });
      return;
  }
  if (!descricao) {
      res.status(400).json({ msg: "A descrição é obrigatória" });
      return;
  }
  if (!status) {
      res.status(400).json({ msg: "O status é obrigatório" });
      return;
  }

  const tarefaAtualizada = {
      tarefa,
      descricao,
      status,
  };

  try {
      const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, { where: { id } });
      if (linhasAfetadas <= 0) {
          res.status(404).json({ msg: "Tarefa não encontrada" });
          return;
      }
      res.status(200).json({ msg: "Tarefa atualizada" });
  } catch (error) {
      res.status(500).json({ msg: "Erro ao atualizar tarefa" });
  }
};


export const updateStatusTarefa = async (req, res) => {
  const { id } = req.params;

  try {
      const tarefa = await Tarefa.findOne({ raw: true, where: { id } });
      if (tarefa === null) {
          res.status(404).json({ msg: "Tarefa não encontrada" });
          return;
      }

      if (tarefa.status === "pendente") {
          await Tarefa.update({ status: "concluida" }, { where: { id } });
          return res.status(200).json({ msg: "Atividade concluída" });
      } else if (tarefa.status === "concluida") {
          await Tarefa.update({ status: "pendente" }, { where: { id } });
          return res.status(200).json({ msg: "Atividade marcada como pendente" });
      }
  } catch (error) {
      res.status(500).json({ err: "Erro ao atualizar tarefa" });
  }
};

  
export const buscarTarefaPorSituacao = async (req, res) => {
  const { situacao } = req.params;

  if (situacao !== "pendente" && situacao !== "concluida") {
      res.status(400).json({
          msg: "Situação inválida. Use 'pendente' ou 'concluida'."
      });
      return;
  }

  try {
      const tarefas = await Tarefa.findAll({
          where: { status: situacao },
          raw: true,
      });

      res.status(200).json(tarefas);
  } catch (error) {
      res.status(500).json({ err: "Erro ao buscar tarefas" });
  }
};
