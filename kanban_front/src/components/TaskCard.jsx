import React, { useState } from "react";
import TaskDetailModal from "./TaskDetailModal";
import { calculateProgress } from "../utils/progress";

export default function TaskCard({ task, cardNumber, onDelete, onUpdate }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const title = task.title || task.Title || "Sem título";
  const author = task.author || task.Author || "Não atribuído";
  const description = task.description || "";
  const isDone = task.status?.toLowerCase() === "done";

  const progress =
    task.progress !== undefined
      ? task.progress
      : calculateProgress(task.start_date, task.due_date, task.status);

  const handleToggleDone = (e) => {
    e.stopPropagation();
    const newStatus = isDone ? "in_progress" : "done";

    onUpdate(task.id, {
      title,
      description,
      author,
      start_date: task.start_date,
      due_date: task.due_date,
      progress: calculateProgress(task.start_date, task.due_date, newStatus),
      status: newStatus,
    });
  };

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className={`bg-[#122328]/80 hover:bg-[#182e35] backdrop-blur-md border rounded-2xl p-4 cursor-pointer transition-all shadow-md group flex flex-col gap-3 ${
          isDone
            ? "border-emerald-500/30 bg-[#0f2425]/90"
            : "border-white/10 hover:border-[#c8a362]/40"
        }`}
      >
   
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isDone && (
              <input
                type="checkbox"
                checked={true}
                onChange={handleToggleDone}
                className="w-4 h-4 accent-emerald-500 cursor-pointer rounded shrink-0"
                title="Desmarcar como concluído"
              />
            )}

        
            {cardNumber !== undefined && (
              <span className="text-xs font-mono font-bold text-[#c8a362] bg-[#c8a362]/10 px-2 py-0.5 rounded-md border border-[#c8a362]/20 shrink-0">
                #{cardNumber}
              </span>
            )}

            <h3
              className={`font-semibold text-sm transition-colors line-clamp-2 ${
                isDone
                  ? "text-slate-300 line-through decoration-emerald-500/70"
                  : "text-slate-100 group-hover:text-[#c8a362]"
              }`}
            >
              {title}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-slate-500 hover:text-red-400 text-xs p-1 rounded transition-colors shrink-0"
            title="Excluir tarefa"
          >
            ✕
          </button>
        </div>

     
        {description && (
          <p className="text-slate-400 text-xs line-clamp-2">{description}</p>
        )}

  
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Progresso</span>
            <span
              className={`font-mono font-medium ${
                isDone ? "text-emerald-400" : "text-[#c8a362]"
              }`}
            >
              {progress}%
            </span>
          </div>
          <div className="w-full bg-[#081214] h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isDone
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-[#c8a362] to-[#e6be85]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <span className="truncate max-w-[140px] text-slate-400">
            {author}
          </span>
          {isDone && (
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Concluído
            </span>
          )}
        </div>
      </div>

      {isDetailOpen && (
        <TaskDetailModal
          task={task}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}