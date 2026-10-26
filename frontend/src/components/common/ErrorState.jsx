import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="card-base p-8 text-center max-w-md mx-auto my-6 border-rose-200 bg-rose-50/50">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">{title}</h3>
      <p className="text-zinc-600 text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-secondary text-xs inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
