import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgStyle = 'bg-slate-900 text-white border-slate-700 shadow-xl';
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-rose-950 text-rose-50 border-rose-800 shadow-xl shadow-rose-950/20';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgStyle = 'bg-indigo-950 text-indigo-50 border-indigo-800 shadow-xl shadow-indigo-950/20';
          iconColor = 'text-indigo-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${bgStyle} animate-in slide-in-from-bottom-3 duration-200 transition-all`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
