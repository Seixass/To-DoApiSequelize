import React from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

function ToDoForm () {

    const [tarefa, setTarefa] = React.useState('')
    const [descricao, setDescricao] = React.useState('')
    const [mensagem, setMensagem] = React.useState(null)


    const handleSubmit = async (event) => {

        event.preventDefault()

        try {
            await axios.post("http://localhost:9090/tarefas", {
                tarefa,
                descricao
            });
            setTarefa('')
            setDescricao('')
            setMensagem("Sua tarefa doi criada com sucesso")
        } catch {
            console.log("Deu Erro!")
            setMensagem("Não foi possivel criar essa tarefa!")
        }

    }


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Titulo</Form.Label>
        <Form.Control
         type="text"
         placeholder="Digite o título da sua tarefa..."
         value={tarefa} 
         onChange={(e) => setTarefa(e.target.value)}
         />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Descricao</Form.Label>
        <Form.Control
         as="textarea"
         rows={3}
         value={descricao}
         onChange={(e) => setDescricao(e.target.value)} />
      </Form.Group>
      <Button type= "submit"> + </Button>
    {mensagem && <p>{mensagem}</p>}
    </Form>
  );
}

export default ToDoForm;