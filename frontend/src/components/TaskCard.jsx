import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function TaskCard({ task, onClick, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id || task.Id);
    setShowConfirmDelete(false);
  };

  const title = task.title || task.Title || "";
  const description = task.description || task.Description || "";
  const progress = task.progress ?? task.Progress ?? 0;
  const taskId = task.id || task.Id;


  const isDone = progress === 100;
  const progressTextColor = isDone ? "text-emerald-400" : "text-[#c8a362]";
  const progressBarGradient = isDone
    ? "from-emerald-500 to-green-400"
    : "from-[#c8a362] to-[#e6be85]";

  return (
    <>
      <div
        onClick={() => onClick && onClick(task)}
        className="bg-[#112125]/80 hover:bg-[#112125] border border-white/5 hover:border-[#c8a362]/40 rounded-2xl p-4 cursor-pointer transition-all duration-200 group relative shadow-lg select-none"
      >
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#081214] text-[#c8a362] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#c8a362]/20 font-bold">
              #{taskId}
            </span>
            <h3 className="font-bold text-slate-100 text-xs truncate max-w-[170px]">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleDeleteClick}
            className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10 text-xs"
            title="Excluir tarefa"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-[11px] line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="text-slate-500 font-semibold uppercase tracking-wider">
              PROGRESSO
            </span>
            <span className={`font-mono font-bold transition-colors ${progressTextColor}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-[#081214] h-1.5 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full bg-gradient-to-r ${progressBarGradient} transition-all duration-300 rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Excluir Tarefa"
        message={`Tem certeza que deseja excluir a tarefa #${taskId} "${title}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </>
  );
}