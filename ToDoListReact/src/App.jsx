import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Container, Form, Button, Table, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const taskSchema = z.object({
  date: z.string().min(1, { message: "Debe seleccionar una fecha" }),
  name: z.string().min(6, { message: "El nombre debe tener mínimo 6 caracteres" }),
  description: z.string().optional(),
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
  });

  const getButtonVariant = () => {
    if (!isValid) return "secondary";
    return editingId ? "warning" : "success";
  };

  const onSubmit = (data) => {
    if (editingId) {
      setTasks(tasks.map((task) => (task.id === editingId ? { ...data, id: editingId } : task)));
      setEditingId(null);
    } else {
      setTasks([...tasks, { ...data, id: Date.now() }]);
    }
    reset();
  };

  const handleEdit = (task) => {
    setValue("date", task.date);
    setValue("name", task.name);
    setValue("description", task.description);
    setEditingId(task.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center">Gestor de Tareas</h2>
      <Row className="mb-5">
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-sm">
            <Form.Group className="mb-3">
              <Form.Label>Fecha (Obligatorio)</Form.Label>
              <Form.Control type="date" {...register("date")} />
              {errors.date && <small className="text-danger">{errors.date.message}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre de la tarea</Form.Label>
              <Form.Control type="text" {...register("name")} placeholder="Ej. Comprar víveres" />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Descripción (Opcional)</Form.Label>
              <Form.Control as="textarea" rows={3} {...register("description")} />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant={getButtonVariant()} type="submit">
                {editingId ? "Actualizar" : "Guardar"}
              </Button>
              {editingId && (
                <Button variant="outline-secondary" onClick={() => { reset(); setEditingId(null); }}>
                  Cancelar Edición
                </Button>
              )}
            </div>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No hay tareas</td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{formatDate(task.date)}</td>
                    <td>{task.name}</td>
                    <td>{task.description || "Sin descripción"}</td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(task)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}