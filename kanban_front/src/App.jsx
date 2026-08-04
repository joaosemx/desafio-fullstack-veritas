import TaskCard from "./components/TaskCard";

export default function App() {
  const mockTasks = [
    { id: 1, title: "Criar layout base", description: "Montar as colunas estáticas no React", status: "TODO" },
    { id: 2, title: "Conectar com backend", description: "Integrar chamadas de API com a rota em Go", status: "IN_PROGRESS" },
    { id: 3, title: "Setup da API", description: "Rotas do CRUD prontas em Go", status: "DONE" },
  ];

  const columns = [
    { title: "A Fazer", status: "TODO", color: "border-blue-500" },
    { title: "Em Andamento", status: "IN_PROGRESS", color: "border-amber-500" },
    { title: "Concluído", status: "DONE", color: "border-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-slate-400 text-sm mt-1">Gerenciador de Tarefas</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col.status}
            className={`bg-slate-900/60 rounded-xl p-4 border-t-4 ${col.color} border-x border-b border-slate-800 flex flex-col gap-4 min-h-[500px]`}
          >
            <h2 className="font-bold text-lg text-slate-200 flex items-center justify-between">
              {col.title}
              <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                {mockTasks.filter((t) => t.status === col.status).length}
              </span>
            </h2>

            <div className="flex flex-col gap-3">
              {mockTasks
                .filter((task) => task.status === col.status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                  />
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}