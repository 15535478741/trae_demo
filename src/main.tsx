import { useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { useAuthStore } from '@/store/useAuthStore';

function AuthInitializer() {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthInitializer />
  </StrictMode>,
);