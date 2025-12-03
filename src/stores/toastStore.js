import { create } from 'zustand';

const useToastStore = create((set, get) => ({
    toasts: [],

    // Add a new toast
    addToast: (message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        set(state => ({
            toasts: [...state.toasts, toast]
        }));

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, duration);
        }

        return id;
    },

    // Remove a toast by ID
    removeToast: (id) => {
        set(state => ({
            toasts: state.toasts.filter(toast => toast.id !== id)
        }));
    },

    // Clear all toasts
    clearAll: () => {
        set({ toasts: [] });
    },

    // Helper methods for different toast types
    success: (message, duration) => get().addToast(message, 'success', duration),
    error: (message, duration) => get().addToast(message, 'error', duration),
    info: (message, duration) => get().addToast(message, 'info', duration),
    warning: (message, duration) => get().addToast(message, 'warning', duration),
}));

export default useToastStore;
