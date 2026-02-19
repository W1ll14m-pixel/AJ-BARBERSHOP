import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4"
         onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-[#e8e8e8] shadow-xl p-6 animate-fade-in"
           onClick={e => e.stopPropagation()}>
        {danger && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#fff5f5] flex items-center justify-center">
              <AlertTriangle size={22} className="text-[#9b2226]" />
            </div>
          </div>
        )}
        <h3 className="text-[15px] font-semibold text-center text-[#0a0a0a] mb-2">{title}</h3>
        {message && <p className="text-[13px] text-[#666] text-center mb-6 leading-relaxed">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 border border-[#e8e8e8] rounded-xl text-[13px] font-medium text-[#333] hover:bg-[#f4f4f4] transition-colors btn-press"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl text-[13px] font-semibold transition-colors btn-press ${
              danger
                ? 'bg-[#9b2226] text-white hover:bg-[#7d1a1e]'
                : 'bg-[#0a0a0a] text-white hover:bg-[#333]'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
