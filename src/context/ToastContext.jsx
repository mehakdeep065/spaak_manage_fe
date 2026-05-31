import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastIcons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  };

  const toastStyles = {
    success: 'border-l-4 border-green-500 bg-white',
    error: 'border-l-4 border-red-500 bg-white',
    warning: 'border-l-4 border-amber-500 bg-white',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${toastStyles[toast.type]} shadow-lg rounded-lg p-4 flex items-start gap-3 animate-slide-in-right`}
          >
            {toastIcons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 rounded-b-lg overflow-hidden">
              <div
                className={`h-full toast-progress ${
                  toast.type === 'success'
                    ? 'bg-green-500'
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
