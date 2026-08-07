import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function CreateTaskModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("todo");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (!title.trim()) {
      errs.title = "O título é obrigatório.";
    }

    if (!description.trim() || description.trim().length < 10) {
      errs.description = "A descrição deve conter no mínimo 10 caracteres.";
    }

    if (!author.trim() || author.trim().length < 3) {
      errs.author = "O nome do autor deve conter no mínimo 3 caracteres.";
    }

    if (!startDate) {
      errs.startDate = "A data inicial é obrigatória.";
    }

    if (!dueDate) {
      errs.dueDate = "A data limite é obrigatória.";
    } else if (startDate && new Date(dueDate) < new Date(startDate)) {
      errs.dueDate = "A data limite não pode ser anterior à data inicial.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await onCreate({
        title,
        description,
        author,
        status,
        start_date: startDate,
        due_date: dueDate,
      });

      setTitle("");
      setDescription("");
      setAuthor("");
      setStatus("todo");
      setStartDate("");
      setDueDate("");
      setErrors({});
      onClose();
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.response?.data?.error || "Erro ao conectar com o servidor.";
      setApiError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#112125] border border-[#c8a362]/30 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8a362]"></span>
            <h2 className="font-bold text-sm tracking-wider uppercase text-slate-100">
              CRIAR NOVA TAREFA
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
              TÍTULO *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-[#081214] border ${
                errors.title ? "border-red-500" : "border-white/10"
              } rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60`}
            />
            {errors.title && (
              <span className="text-red-400 text-[10px] mt-1 block">
                {errors.title}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
              DESCRIÇÃO * (MIN. 10 CARACTERES)
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-[#081214] border ${
                errors.description ? "border-red-500" : "border-white/10"
              } rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60 resize-none`}
            />
            {errors.description && (
              <span className="text-red-400 text-[10px] mt-1 block">
                {errors.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#081214] border border-white/10 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60"
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Andamento</option>
                <option value="done">Concluído</option>
              </select>
            </div>

            <div>
              <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
                AUTOR * (MIN. 3 CARACTERES)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full bg-[#081214] border ${
                  errors.author ? "border-red-500" : "border-white/10"
                } rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60`}
              />
              {errors.author && (
                <span className="text-red-400 text-[10px] mt-1 block">
                  {errors.author}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
                DATA INICIAL *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full bg-[#081214] border ${
                  errors.startDate ? "border-red-500" : "border-white/10"
                } rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60`}
              />
              {errors.startDate && (
                <span className="text-red-400 text-[10px] mt-1 block">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[#c8a362] font-semibold mb-1 uppercase tracking-wider">
                DATA LIMITE *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full bg-[#081214] border ${
                  errors.dueDate ? "border-red-500" : "border-white/10"
                } rounded-xl p-3 text-slate-100 focus:outline-none focus:border-[#c8a362]/60`}
              />
              {errors.dueDate && (
                <span className="text-red-400 text-[10px] mt-1 block">
                  {errors.dueDate}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl font-semibold transition-colors uppercase tracking-wider"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c8a362] hover:bg-[#b59152] text-slate-950 px-5 py-2.5 rounded-xl font-bold transition-colors uppercase tracking-wider shadow-lg shadow-[#c8a362]/20 disabled:opacity-50"
            >
              {loading ? "CRIANDO..." : "CRIAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}