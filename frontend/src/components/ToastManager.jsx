import React, { useState, useCallback } from 'react';
import Toast from './Toast';

let toastId = 0;

const ToastManager = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = ++toastId;
        const newToast = { id, message, type, duration };
        
        setToasts(prev => [...prev, newToast]);
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Expose addToast globally
    React.useEffect(() => {
        window.showToast = addToast;
        return () => {
            delete window.showToast;
        };
    }, [addToast]);

    return (
        <div className="toast-container">
            {toasts.map((toast, index) => (
                <div 
                    key={toast.id} 
                    style={{ 
                        position: 'fixed',
                        top: `${20 + index * 80}px`,
                        right: '20px',
                        zIndex: 10000 + index
                    }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastManager;