import React, { useState } from "react";

export default function CreateTaskModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formatToISO = (dateString) => {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day, 12, 0, 0).toISOString();
    };

    await onCreate({
      title,
      description,
      author,
      status: "todo",
      start_date: formatToISO(startDate),
      due_date: formatToISO(dueDate),
    });

    setTitle("");
    setDescription("");
    setAuthor("");
    setStartDate("");
    setDueDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-[#0c161d] border border-[#182834] rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-[#182834] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[#cda366] text-lg font-bold">◈</span>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Nova Tarefa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg font-semibold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">
              Título <span className="text-[#cda366]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Criar rotas do CRUD"
              className="bg-[#070d12] border border-[#1e2f3b] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cda366]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">
              Autor / Responsável
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: João Victor"
              className="bg-[#070d12] border border-[#1e2f3b] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cda366]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-300 font-medium">
                Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#070d12] border border-[#1e2f3b] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cda366]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-300 font-medium">
                Entrega (100%)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#070d12] border border-[#1e2f3b] rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cda366]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-300 font-medium">
              Descrição
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
              className="bg-[#070d12] border border-[#1e2f3b] rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cda366] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-[#182834]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs bg-[#152430] hover:bg-[#1e3242] text-slate-300 rounded-full font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs bg-[#cda366] hover:bg-[#b88f54] text-slate-950 rounded-full font-semibold"
            >
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}