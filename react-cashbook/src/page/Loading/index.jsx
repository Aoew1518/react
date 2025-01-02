import React, { useEffect, useState } from 'react';
import './index.css';

const Toast = ({ message, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="toast">
            {message}
        </div>
    );
};

export default Toast;