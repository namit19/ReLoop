import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card-base w-full max-w-md p-6 bg-white shadow-soft-xl relative animate-scale-up">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
        </div>

        <p className="text-zinc-600 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`text-sm px-4 py-2.5 rounded-xl font-medium text-white transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-[0.98]'
                : 'btn-primary'
            }`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
