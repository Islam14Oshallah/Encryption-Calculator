import { createContext } from 'react';
import Layout from './components/Layout';
import EncryptionForm from './components/EncryptionForm';

// Define the NotificationContextType
interface NotificationContextType {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  setNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}

// Create the context with a default value
export const NotificationContext = createContext<NotificationContextType>({
  message: '',
  type: 'info',
  show: false,
  setNotification: () => {},
  clearNotification: () => {}
});

function App() {
  return (
    <Layout>
      <EncryptionForm />
    </Layout>
  );
}

export default App;