import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./components/TaskCard";
import CreateTaskModal from "./components/CreateTaskModal";
import TaskDetailModal from "./components/TaskDetailModal";
import { getCards, createTask, updateTask, deleteTask } from "./services/api";
import { calculateProgress } from "./utils/progress";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
      const startDate = newTaskData.start_date || newTaskData.StartDate || "";
      const dueDate = newTaskData.due_date || newTaskData.DueDate || "";
      const status = newTaskData.status ? newTaskData.status.toLowerCase() : "todo";

      const computedProgress = calculateProgress(startDate, dueDate, status);

      const payload = {
        ...newTaskData,
        progress: computedProgress,
      };

      await createTask(payload);
      setIsModalOpen(false);
      await loadCards();
    } catch (err) {
      console.error("Erro detalhado ao criar tarefa:", err);
      alert("Erro ao criar a tarefa.");
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
  try {
    const taskToUpdate = tasks.find((t) => Number(t.id) === Number(id));
    
    const startDate = updatedData.start_date || updatedData.StartDate || taskToUpdate?.start_date || "";
    const dueDate = updatedData.due_date || updatedData.DueDate || taskToUpdate?.due_date || "";
    const status = updatedData.status ? updatedData.status.toLowerCase() : (taskToUpdate?.status || "todo");

    const computedProgress = calculateProgress(startDate, dueDate, status);

    const finalProgress = status === "done" 
      ? 100 
      : (computedProgress !== undefined ? computedProgress : (taskToUpdate?.progress || 0));

    const finalPayload = {
      ...updatedData,
      progress: finalProgress,
    };

    await updateTask(id, finalPayload);
    await loadCards(); // Recarrega os dados
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    alert("Erro ao salvar alterações.");
  }
};

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await loadCards();
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
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
        (t) => (t.status || "todo").toLowerCase() === sourceStatus.toLowerCase()
      );

      const [reorderedItem] = currentColumnTasks.splice(source.index, 1);
      currentColumnTasks.splice(destination.index, 0, reorderedItem);

      const newTasks = [];
      let columnIdx = 0;

      for (const t of tasks) {
        if ((t.status || "todo").toLowerCase() === sourceStatus.toLowerCase()) {
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

    // .slice(0, 10) corta a data para "YYYY-MM-DD", pois o backend retorna
    // as datas em RFC3339 (ex: "2026-08-07T00:00:00Z") e o endpoint de
    // update só aceita o formato curto de data.
    const startDate = (taskToUpdate.start_date || taskToUpdate.StartDate || "").slice(0, 10);
    const dueDate = (taskToUpdate.due_date || taskToUpdate.DueDate || "").slice(0, 10);
    const newProgress = calculateProgress(startDate, dueDate, destStatus);

    const updatedTasks = tasks.map((t) =>
      Number(t.id) === taskId
        ? { ...t, status: destStatus, progress: newProgress }
        : t
    );
    setTasks(updatedTasks);

    try {
      await updateTask(taskId, {
        title: taskToUpdate.title || taskToUpdate.Title || "",
        description: taskToUpdate.description || taskToUpdate.Description || "",
        status: destStatus,
        author: taskToUpdate.author || taskToUpdate.Author || "",
        start_date: startDate,
        due_date: dueDate,
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
          <div className="h-10 md:h-12 w-auto max-w-[320px] flex items-center">
            <svg
              preserveAspectRatio="xMidYMid meet"
              data-bbox="-0.03 0 868.01 234.25"
              viewBox="0 0 867.99 234.26"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_2px_10px_rgba(200,163,98,0.25)]"
              role="img"
              aria-label="Logo Veritas Consultoria Empresarial"
            >
              <g>
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2="117.13"
                    x2="170.34"
                    y1="117.13"
                    x1="0"
                    id="veritas_header_gradient"
                  >
                    <stop stopColor="#c6aa76" offset="0"></stop>
                    <stop stopColor="#efdbb2" offset="1"></stop>
                  </linearGradient>
                </defs>
                <g>
                  <path
                    d="M43.38 120.02c.07 0 .14.03.19.07l1.08 1L78.11 152l2.78 2.57 3.38 3.12c.05.05.12.07.19.07h1.37c.07 0 .14-.03.19-.07l3.38-3.12 2.78-2.57 33.46-30.91 1.08-1c.05-.05.12-.07.19-.07H170c.15 0 .27-.12.27-.27V98.96c0-12.96-5.41-25.32-14.93-34.11-8.3-7.67-16.6-15.33-24.9-23l-4.25-3.93-16.26-15.02-4.25-3.93L89.4 3.93 85.15 0 80.9 3.93 64.62 18.97l-4.25 3.93-16.26 15.02-4.25 3.93L5.78 73.3l-2.19 2.02-1.06.98-2.44 2.26c-.05.05-.08.12-.09.19-.02.41.02 1.06.39 1.7.65 1.13 2.03 1.75 3.55 1.63h41.81c.07 0 .14-.03.19-.07l6.17-5.7 12.52-11.57 4.25-3.93 16.26-15.02 16.25 15.01 4.25 3.93 12.52 11.57 6 5.54c.11.1.28.1.39-.01a5.43 5.43 0 0 0-.26-7.72c-4.8-4.43-9.6-8.87-14.4-13.3l-4.25-3.93-16.26-15.02-4.24-3.92-4.25 3.92-16.26 15.02-4.25 3.93-16.69 15.42c-.05.05-.12.07-.19.07H11.73c-.25 0-.37-.31-.19-.48l32.54-30.06 4.25-3.93 16.26-15.02 4.25-3.93L85.12 7.84l16.28 15.03 4.25 3.93 16.26 15.02 4.25 3.93c8.34 7.7 16.68 15.41 25.02 23.11s13.29 18.84 13.29 30.37v14.73c0 .15-.12.27-.27.27h-37.38c-.07 0-.14-.03-.19-.07l-1.02-.94-33.75-31.17-2.5-2.31-3.74-3.45h-.92c-.07 0-.14.03-.19.07l-3.66 3.38-2.51 2.31-33.74 31.17-1.02.94c-.05.05-.12.07-.19.07H.24c-.15 0-.27.12-.27.27v22.37a42.84 42.84 0 0 0 13.77 31.47c8.69 8.02 17.37 16.05 26.06 24.07l4.25 3.93 16.26 15.02 4.25 3.93 16.28 15.04 4.24 3.92 4.25-3.93 16.28-15.04 4.25-3.93 16.26-15.02 4.25-3.93 34.06-31.46 2.19-2.02 1.06-.98 2.46-2.27s.07-.09.08-.15c.06-.35.2-1.57-.69-2.5-.77-.8-1.77-.84-1.97-.84h-43.1c-.07 0-.14.03-.19.07l-6.17 5.7-12.52 11.57-4.25 3.93-16.26 15.02-16.25-15.01-4.25-3.93-12.52-11.57-6.03-5.57c-.1-.1-.27-.1-.37 0a5.148 5.148 0 0 0 .03 7.54l14.64 13.53 4.25 3.93 16.26 15.02 4.24 3.92 4.25-3.92 16.26-15.02 4.25-3.93 16.69-15.42c.05-.05.12-.07.19-.07h31.76c.25 0 .37.31.19.48l-32.54 30.06-4.25 3.93-16.26 15.02-4.25 3.93-16.28 15.04L68.8 211.4l-4.25-3.93-16.26-15.02-4.25-3.93-25.16-23.24a40.912 40.912 0 0 1-13.16-30.06V120.3c0-.15.12-.27.27-.27h37.32Zm8.66-5.77 33.1-30.57 33.09 30.57 2.93 2.71c.12.11.12.29 0 .4l-2.88 2.66-33.15 30.62-33.16-30.62-2.88-2.66a.267.267 0 0 1 0-.4l2.93-2.71Z"
                    fill="url(#veritas_header_gradient)"
                  ></path>
                  <path d="m236.33 66.59 31.59 86.8 31.59-86.8h6.06l-37.65 103.42-37.59-103.42h6Z" fill="#ffffff"></path>
                  <path d="M394.63 66.59v5.69h-44.85v42.01h44.85v5.69h-44.85v42.01h44.85v5.69h-50.54V66.6h50.54Z" fill="#ffffff"></path>
                  <path d="M462.45 132.55c-.55.04-1.12.06-1.71.06h-17.18v35.06h-5.69V66.59h26.53c7.71 1.05 14.26 4.28 19.65 9.67 6.44 6.44 9.67 14.21 9.67 23.31s-3.22 16.93-9.67 23.38c-4.46 4.46-9.58 7.39-15.35 8.78l23.31 35.95H485l-22.55-35.13Zm-18.89-60.21v54.52h17.18c7.5 0 13.91-2.66 19.24-7.99 5.33-5.33 7.99-11.76 7.99-19.3s-2.66-13.96-7.99-19.27c-5.33-5.31-11.74-7.96-19.24-7.96h-17.18Z" fill="#ffffff"></path>
                  <path d="M539.5 66.59v101.08h-5.69V66.59h5.69Z" fill="#ffffff"></path>
                  <path d="M610.55 72.28v95.4h-5.69v-95.4h-25.59v-5.69h56.86v5.69h-25.59Z" fill="#ffffff"></path>
                  <path d="M718.87 128.94h-35l-14.09 38.73h-6.06l37.65-103.42 37.59 103.42h-6l-14.09-38.73Zm-2.08-5.68-15.41-42.39-15.41 42.39h30.83Z" fill="#ffffff"></path>
                  <path d="M806.22 111.7c-7.2-2.4-12.89-5.69-17.06-9.86-4.17-4.17-6.25-9.22-6.25-15.16s2.08-10.81 6.25-15c4.17-4.19 9.22-6.29 15.16-6.29s10.95 2.08 15.16 6.25c2.32 2.23 3.92 4.74 4.8 7.52l-5.12 2.02c-.76-2.06-2-3.96-3.73-5.69-3.07-3.03-6.78-4.55-11.12-4.55s-8.05 1.53-11.12 4.58c-3.07 3.05-4.61 6.77-4.61 11.15s1.54 8.05 4.61 11.12c2.86 2.82 6.82 5.41 11.88 7.77 8.09 2.61 14.89 6.68 20.41 12.19 5.85 5.81 8.78 12.85 8.78 21.1s-2.93 15.37-8.78 21.23c-5.85 5.85-12.91 8.78-21.16 8.78s-15.31-2.95-21.16-8.84c-4.68-4.68-7.48-10.11-8.4-16.3l5.37-1.96c.59 5.48 2.93 10.26 7.01 14.34 4.76 4.76 10.49 7.14 17.18 7.14s12.49-2.38 17.25-7.14 7.14-10.51 7.14-17.25-2.38-12.42-7.14-17.18c-4.17-4.17-9.29-7.5-15.35-9.98Z" fill="#ffffff"></path>
                </g>
              </g>
            </svg>
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
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
              (t) => (t.status || "todo").toLowerCase() === col.status.toLowerCase()
            );

            return (
              <div
                key={col.id}
                className={`bg-[#112125]/70 backdrop-blur-xl rounded-3xl p-5 border ${col.color} flex flex-col gap-4 min-h-[580px] shadow-2xl`}
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
                      (t) => Number(t.id) === Number(task?.id)
                    );
                    const cardNumber =
                      globalIndex !== -1 ? globalIndex + 1 : rubric.source.index + 1;

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transform: provided.draggableProps.style?.transform,
                        }}
                      >
                        <TaskCard
                          task={task}
                          cardNumber={cardNumber}
                          onClick={(t) => setSelectedTask(t)}
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
                                    onClick={(t) => setSelectedTask(t)}
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

      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}