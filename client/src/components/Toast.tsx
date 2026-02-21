import { useFleetStore } from '../store/fleetStore';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ToastContainer() {
    const { toasts, removeToast } = useFleetStore();

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 9999,
            pointerEvents: 'none' // Let clicks pass through empty space
        }}>
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function Toast({ toast, onClose }: { toast: any, onClose: () => void }) {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger exit animation shortly before it's removed from store
        const timer = setTimeout(() => {
            setIsLeaving(true);
        }, 3200);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={20} color="var(--success)" />;
            case 'error': return <AlertCircle size={20} color="var(--danger)" />;
            case 'info': return <Info size={20} color="var(--info)" />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div style={{
            background: 'var(--panel-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '400px',
            color: 'var(--text-primary)',
            pointerEvents: 'auto', // Re-enable clicks
            animation: isLeaving ? 'slideOutRight 0.3s ease forwards' : 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        }}>
            {getIcon()}
            <span style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4' }}>{toast.message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '4px'
                }}
            >
                <X size={16} />
            </button>
        </div>
    );
}
