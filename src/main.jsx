import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from "./contexts/AuthProvider.jsx";
import PermissionsProvider from './contexts/PermissionsProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <PermissionsProvider>
      <App />
    </PermissionsProvider>
  </AuthProvider>
);
