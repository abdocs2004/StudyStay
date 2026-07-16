import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './hooks/useAuth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
