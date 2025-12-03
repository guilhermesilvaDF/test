import useToastStore from '../stores/toastStore';

export default function Toast() {
    const toasts = useToastStore(state => state.toasts);
    const removeToast = useToastStore(state => state.removeToast);

    const getToastStyles = (type) => {
        const baseStyles = 'flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border';

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500/10 border-green-500/50 text-green-400`;
            case 'error':
                return `${baseStyles} bg-red-500/10 border-red-500/50 text-red-400`;
            case 'warning':
                return `${baseStyles} bg-yellow-500/10 border-yellow-500/50 text-yellow-400`;
            default: // info
                return `${baseStyles} bg-blue-500/10 border-blue-500/50 text-blue-400`;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return 'ph-fill ph-check-circle';
            case 'error':
                return 'ph-fill ph-warning-circle';
            case 'warning':
                return 'ph-fill ph-warning';
            default:
                return 'ph-fill ph-info';
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type)} animate-slide-in-right`}
                >
                    <i className={`${getIcon(toast.type)} text-2xl`}></i>
                    <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-current opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <i className="ph ph-x text-lg"></i>
                    </button>
                </div>
            ))}
        </div>
    );
}
