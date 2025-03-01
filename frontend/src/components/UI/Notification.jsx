import React, { useEffect, useState } from 'react';

const Notification = ({ message, type = 'info', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!visible) return null;
  
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">{message}</div>
      <button 
        className="notification-close" 
        onClick={() => setVisible(false)}
      >
        ×
      </button>
    </div>
  );
};

export default Notification;