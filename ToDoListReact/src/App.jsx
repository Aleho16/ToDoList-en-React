import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const taskSchema = z.object({
  date: z.string().min(1, { message: "Debe seleccionar una fecha" }),
  name: z.string().min(6, { message: "El nombre debe tener mínimo 6 caracteres" }),
  description: z.string().optional(),
});

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Formulario listo:", data);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Gestor de Tareas</h2>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <p className="text-center">Formulario en construcción...</p>
        </Col>
      </Row>
    </Container>
  );
}