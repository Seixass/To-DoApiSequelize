import React from "react";
import AutoLayout from "../Components/AutoLayoutColumns.jsx";
import ToDoForm from "../components/ToDoForm.jsx";
import { Container } from "react-bootstrap";

const App = () => {
    return (
        <Container>
            <ToDoForm />
        </Container>
    )
}

export default App;