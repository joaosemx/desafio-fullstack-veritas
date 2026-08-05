import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./components/TaskCard";
import CreateTaskModal from "./components/CreateTaskModal";
import { getCards, createTask, updateTask, deleteTask } from "./services/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadCards() {
    try {
      setLoading(true);
      const data = await getCards();
      setTasks(data || []);
      setError(null);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  const handleCreateTask = async (newTaskData) => {
    try {
      await createTask(newTaskData);
      await loadCards();
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
      alert("Erro ao criar a tarefa.");
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      await updateTask(id, updatedData);
      await loadCards();
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
      alert("Erro ao salvar alterações.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await deleteTask(id);
      await loadCards();
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      alert("Erro ao deletar a tarefa.");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId;
    const taskToUpdate = tasks.find((t) => t.id === taskId);

    if (!taskToUpdate) return;

    // Atualização otimista na tela (Optimistic UI)
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await updateTask(taskId, {
        title: taskToUpdate.Title || taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus,
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      await loadCards(); 
    }
  };

  const columns = [
    { title: "A fazer", status: "todo", color: "border-blue-500" },
    { title: "Em andamento", status: "in_progress", color: "border-amber-500" },
    { title: "Concluído", status: "done", color: "border-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-slate-400 text-sm mt-1">Gerenciador de Tarefas</p>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const filteredTasks = tasks.filter(
              (t) => t.status?.toLowerCase() === col.status.toLowerCase()
            );

            return (
              <div
                key={col.status}
                className={`bg-slate-900/60 rounded-xl p-4 border-t-4 ${col.color} border-x border-slate-800 flex flex-col gap-4 min-h-[500px]`}
              >
                <h2 className="font-bold text-lg text-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{col.title}</span>
                    {col.status === "todo" && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all text-sm font-bold"
                        title="Adicionar tarefa"
                      >
                        +
                      </button>
                    )}
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                    {filteredTasks.length}
                  </span>
                </h2>

                <Droppable droppableId={col.status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col gap-3 flex-1 rounded-lg p-1 transition-colors ${
                        snapshot.isDraggingOver ? "bg-slate-800/40" : ""
                      }`}
                    >
                      {loading ? (
                        <p className="text-slate-500 text-sm italic">Carregando...</p>
                      ) : (
                        filteredTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >
                            {(provided) => (
                              <TaskCard
                                task={task}
                                provided={provided}
                                onDelete={handleDeleteTask}
                                onUpdate={handleUpdateTask}
                              />
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </main>
      </DragDropContext>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}