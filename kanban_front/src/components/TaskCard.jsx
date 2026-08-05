import React, { useState } from "react";

export default function TaskCard({ task, provided, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.Title || task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleSave = async () => {
    if (!title.trim()) return;
    await onUpdate(task.id, { title, description, status: task.status });
    setIsEditing(false);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm text-slate-100 flex flex-col gap-2 transition-all hover:border-slate-600 group"
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm font-semibold text-slate-100 focus:outline-none focus:border-blue-500"
          />
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white"
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm text-slate-100">{task.Title || task.title}</h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-slate-400 hover:text-blue-400 p-1"
                title="Editar"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-xs text-slate-400 hover:text-red-400 p-1"
                title="Excluir"
              >
                Deletar
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
          )}

          <span className="text-[10px] self-start px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 font-mono mt-1 uppercase tracking-wider">
            {task.status}
          </span>
        </>
      )}
    </div>
  );
}