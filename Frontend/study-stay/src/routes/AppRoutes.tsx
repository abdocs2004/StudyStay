import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/public/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import StudentDashboard from '../features/dashboard/pages/StudentDashboard';
import NotFound from '../features/public/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
