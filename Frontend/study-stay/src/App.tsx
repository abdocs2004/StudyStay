import React from 'react';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
