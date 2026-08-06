import React, { useState, useEffect } from "react";
import { calculateProgress } from "../utils/progress";

export default function TaskDetailModal({ task, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    status: "todo",
    start_date: "",
    due_date: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || task.Title || "",
        description: task.description || "",
        author: task.author || task.Author || "",
        status: task.status?.toLowerCase() || "todo",
        start_date: task.start_date ? task.start_date.split("T")[0] : "",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const originalData = {
    title: task.title || task.Title || "",
    description: task.description || "",
    author: task.author || task.Author || "",
    status: task.status?.toLowerCase() || "todo",
    start_date: task.start_date ? task.start_date.split("T")[0] : "",
    due_date: task.due_date ? task.due_date.split("T")[0] : "",
  };


  const isUnchanged =
    formData.title.trim() === originalData.title.trim() &&
    formData.description.trim() === originalData.description.trim() &&
    formData.author.trim() === originalData.author.trim() &&
    formData.status === originalData.status &&
    formData.start_date === originalData.start_date &&
    formData.due_date === originalData.due_date;


  const isSaveDisabled = isUnchanged || !formData.title.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaveDisabled) return;

    const computedProgress = calculateProgress(
      formData.start_date,
      formData.due_date,
      formData.status
    );

    onUpdate(task.id, {
      ...formData,
      progress: computedProgress,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#112125] border border-white/15 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative text-slate-100 animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
          <h2 className="text-lg font-semibold tracking-wide text-slate-100">
            Detalhes da Tarefa
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título..."
              className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descrição da tarefa..."
              className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Responsável</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Data Inicial</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Data Limite</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full bg-[#0c1618] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#c8a362] transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaveDisabled}
              className={`px-5 py-2 rounded-xl text-xs font-medium transition-all ${
                isSaveDisabled
                  ? "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                  : "bg-[#c8a362] hover:bg-[#b89252] text-slate-950 font-semibold shadow-lg shadow-[#c8a362]/20 cursor-pointer"
              }`}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}