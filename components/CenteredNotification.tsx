import React, { useEffect } from 'react';

interface CenteredNotificationProps {
  message: string | null;
  onClose: () => void;
}

const CenteredNotification: React.FC<CenteredNotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // Auto-dismiss after 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] animate-modalOpen" onClick={onClose}>
      <div 
        className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 max-w-sm text-center"
      >
        <i className="fas fa-map-marker-alt text-5xl text-blue-300"></i>
        <p className="text-xl font-semibold text-white">{message}</p>
      </div>
    </div>
  );
};

export default CenteredNotification;
