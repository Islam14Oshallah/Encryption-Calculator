import React, { createContext, ReactNode } from 'react';
import { useNotification } from '../hooks/useNotification';
import NotificationContainer from '../components/NotificationContainer';

type NotificationContextType = {
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
};

export const NotificationContext = createContext<NotificationContextType>({
  success: () => '',
  error: () => '',
  warning: () => '',
  info: () => '',
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    removeNotification,
    success,
    error,
    warning,
    info
  } = useNotification();

  return (
    <NotificationContext.Provider
      value={{
        success,
        error,
        warning,
        info
      }}
    >
      {children}
      <NotificationContainer 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};
