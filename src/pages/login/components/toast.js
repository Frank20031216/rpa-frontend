import React, { useEffect } from 'react';
import './toast.css';

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); 

        // 清除定时器，防止内存泄漏
        return () => clearTimeout(timer);
    }, [onClose]); 
    return (
        <div className={`toast ${type}`}>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={onClose}>X</button>
        </div>
    );
}

export default Toast;