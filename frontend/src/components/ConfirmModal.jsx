import React from "react";
import ReactDOM from "react-dom";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "EXCLUIR", cancelText = "CANCELAR" }) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#112125] border border-[#c8a362]/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative text-center">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400 font-bold text-xl">
          !
        </div>
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-xl font-semibold text-xs transition-colors uppercase tracking-wider"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-red-500/80 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs transition-colors uppercase tracking-wider shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}