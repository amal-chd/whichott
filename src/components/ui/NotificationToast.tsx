import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';

interface ToastMessage {
  id: string;
  title: string;
  body: string;
}

export function NotificationToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { title, body } = customEvent.detail;
      const newToast: ToastMessage = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        body
      };

      setToasts(prev => [...prev, newToast]);

      // Remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('sports-notification', handleNotification);
    return () => window.removeEventListener('sports-notification', handleNotification);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-start gap-3 bg-black/60 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(59,130,246,0.25)] relative overflow-hidden"
          >
            {/* Left Accent Glow line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600" />
            
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Bell size={16} className="animate-bounce" />
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {toast.title}
              </h4>
              <p className="text-xs text-text-muted/90 font-medium leading-relaxed">
                {toast.body}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
