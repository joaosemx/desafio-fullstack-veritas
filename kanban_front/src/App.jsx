import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./components/TaskCard";
import CreateTaskModal from "./components/CreateTaskModal";
import { getCards, createTask, updateTask, deleteTask } from "./services/api";
import { calculateProgress } from "./utils/progress";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { id: "col-1", title: "A Fazer", status: "todo", color: "border-white/20" },
    { id: "col-2", title: "Em Andamento", status: "in_progress", color: "border-[#c8a362]/50" },
    { id: "col-3", title: "Concluído", status: "done", color: "border-emerald-500/50" },
  ];

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

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    if (sourceStatus === destStatus) {
      const currentColumnTasks = tasks.filter(
        (t) => t.status?.toLowerCase() === sourceStatus.toLowerCase()
      );

      const [reorderedItem] = currentColumnTasks.splice(source.index, 1);
      currentColumnTasks.splice(destination.index, 0, reorderedItem);

      const newTasks = [];
      let columnIdx = 0;

      for (const t of tasks) {
        if (t.status?.toLowerCase() === sourceStatus.toLowerCase()) {
          newTasks.push(currentColumnTasks[columnIdx]);
          columnIdx++;
        } else {
          newTasks.push(t);
        }
      }

      setTasks(newTasks);
      return;
    }

    const taskId = Number(draggableId);
    const taskToUpdate = tasks.find((t) => Number(t.id) === taskId);

    if (!taskToUpdate) return;

    const newProgress = calculateProgress(
      taskToUpdate.start_date,
      taskToUpdate.due_date,
      destStatus
    );

    const updatedTasks = tasks.map((t) =>
      Number(t.id) === taskId
        ? { ...t, status: destStatus, progress: newProgress }
        : t
    );
    setTasks(updatedTasks);

    try {
      await updateTask(taskId, {
        title: taskToUpdate.Title || taskToUpdate.title,
        description: taskToUpdate.description,
        status: destStatus,
        author: taskToUpdate.author || taskToUpdate.Author || "",
        start_date: taskToUpdate.start_date,
        due_date: taskToUpdate.due_date,
        progress: newProgress,
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      await loadCards();
    }
  };

  return (
    <div className="min-h-screen text-slate-100 p-6 md:p-10 font-sans bg-[#0d1719] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#2a4d46] via-[#162a2d] to-[#0c1618] selection:bg-[#c8a362] selection:text-black">
      
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/15 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8a362] to-[#8a6b32] flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-[#c8a362]/30">
            ◈
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-slate-100 uppercase">
              KANBAN <span className="text-[#c8a362] font-light">FLOW</span>
            </h1>
            <p className="text-slate-300 text-xs tracking-wide">
              Hub de Soluções & Gestão de Operações
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-slate-100 px-6 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3 group"
        >
          <span>Nova Tarefa</span>
          <span className="bg-white text-slate-950 rounded-full w-5 h-5 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
            <svg
              className="w-3 h-3 stroke-current stroke-[2.5]"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </span>
        </button>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-950/50 border border-red-800/60 backdrop-blur-md rounded-2xl text-red-200 text-sm">
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
                key={col.id}
                className={`bg-[#112125]/70 backdrop-blur-xl rounded-3xl p-5 border ${col.color} flex flex-col gap-4 min-h-[580px] shadow-2xl relative overflow-hidden`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c8a362]"></span>
                    <h2 className="font-semibold text-sm text-slate-100 tracking-wide">
                      {col.title}
                    </h2>
                  </div>

                  <span className="text-xs bg-white/10 border border-white/15 text-[#c8a362] px-3 py-1 rounded-full font-mono font-medium">
                    {filteredTasks.length}
                  </span>
                </div>

                <Droppable
                  droppableId={col.status}
                  type="TASK"
                  renderClone={(provided, snapshot, rubric) => {
                    const task = filteredTasks[rubric.source.index];
                    const globalIndex = tasks.findIndex(
                      (t) => Number(t.id) === Number(task.id)
                    );
                    const cardNumber =
                      globalIndex !== -1 ? globalIndex + 1 : rubric.source.index + 1;

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          cardNumber={cardNumber}
                          onDelete={handleDeleteTask}
                          onUpdate={handleUpdateTask}
                        />
                      </div>
                    );
                  }}
                >
                  {(taskProvided, taskSnapshot) => (
                    <div
                      ref={taskProvided.innerRef}
                      {...taskProvided.droppableProps}
                      className={`flex flex-col gap-3 flex-1 rounded-2xl p-1 transition-colors ${
                        taskSnapshot.isDraggingOver ? "bg-white/5" : ""
                      }`}
                    >
                      {loading ? (
                        <p className="text-slate-400 text-xs italic p-2">
                          Carregando tarefas...
                        </p>
                      ) : (
                        filteredTasks.map((task, index) => {
                          const globalIndex = tasks.findIndex(
                            (t) => Number(t.id) === Number(task.id)
                          );
                          const cardNumber =
                            globalIndex !== -1 ? globalIndex + 1 : index + 1;

                          return (
                            <Draggable
                              key={String(task.id)}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(cardProvided) => (
                                <div
                                  ref={cardProvided.innerRef}
                                  {...cardProvided.draggableProps}
                                  {...cardProvided.dragHandleProps}
                                >
                                  <TaskCard
                                    task={task}
                                    cardNumber={cardNumber}
                                    onDelete={handleDeleteTask}
                                    onUpdate={handleUpdateTask}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {taskProvided.placeholder}
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