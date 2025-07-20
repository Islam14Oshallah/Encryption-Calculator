import { useState, useCallback } from 'react';
import { NotificationItem } from '../components/NotificationContainer';
import { NotificationType } from '../components/Notification';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string, duration = 5000) => {
    const id = Date.now().toString();
    
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { id, type, message, duration }
    ]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return addNotification('success', message, duration);
  }, [addNotification]);

  const error = useCallback((message: string, duration?: number) => {
    return addNotification('error', message, duration);
  }, [addNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    return addNotification('warning', message, duration);
  }, [addNotification]);

  const info = useCallback((message: string, duration?: number) => {
    return addNotification('info', message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };
};
