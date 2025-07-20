import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />
};

const bgColors = {
  success: 'bg-green-100 dark:bg-green-800/60',
  error: 'bg-red-100 dark:bg-red-800/60',
  warning: 'bg-yellow-100 dark:bg-yellow-800/60',
  info: 'bg-blue-100 dark:bg-blue-800/60'
};

const textColors = {
  success: 'text-green-700 dark:text-green-200',
  error: 'text-red-700 dark:text-red-200',
  warning: 'text-yellow-700 dark:text-yellow-200',
  info: 'text-blue-700 dark:text-blue-200'
};

const borderColors = {
  success: 'border-green-500',
  error: 'border-red-500',
  warning: 'border-yellow-500',
  info: 'border-blue-500'
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500'
};

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  return (
    <div 
      className={`flex items-start p-4 mb-3 rounded-lg border shadow-lg ${bgColors[type]} ${borderColors[type]} animate-slideIn`}
      style={{
        maxWidth: '350px', 
        animationDelay: '50ms',
        animationFillMode: 'forwards'
      }}
      role="alert"
    >
      <div className={`flex-shrink-0 mr-3 ${iconColors[type]}`}>
        {icons[type]}
      </div>
      <div className="flex-grow">
        <p className={`${textColors[type]} text-sm font-medium`}>{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className={`ml-3 ${textColors[type]} hover:text-opacity-75`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
