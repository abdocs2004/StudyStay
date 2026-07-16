import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../features/public/pages/LandingPage';
import LoginPage from '../features/auth/pages/LoginPage.tsx';
import RegisterPage from '../features/auth/pages/RegisterPage';

import RequestReset from '../features/auth/pages/RequestReset';
import VerifyOTP from '../features/auth/pages/VerifyOTP';
import ResetPassword from '../features/auth/pages/ResetPassword';
import PasswordResetSuccess from '../features/auth/pages/PasswordResetSuccess';
import AccessRestricted from '../features/auth/pages/AccessRestricted';
import ProtectedRoute from './ProtectedRoute';

import StudentProfile from '../features/dashboard/pages/StudentProfile';
import OwnerProfile from '../features/property/pages/OwnerProfile';
import StudentHome from '../features/dashboard/pages/StudentHome';
import OwnerHome from '../features/dashboard/pages/OwnerHome';
import PostDetails from '../features/dashboard/pages/PostDetails';

import PropertyDetails from '../features/property/pages/PropertyDetails';
import FavoritesPage from '../features/property/pages/FavoritesPage';
import ChatPage from '../features/chat/pages/ChatPage';
import BookingPage from '../features/booking/pages/BookingPage';
import NotFound from '../features/public/pages/NotFound';
import Terms from '../features/public/pages/Terms';
import Privacy from '../features/public/pages/Privacy';
import About from '../features/public/pages/About';
import Support from '../features/public/pages/Support';
import Security from '../features/public/pages/Security';
import Careers from '../features/public/pages/Careers';
import Onboarding from '../features/public/pages/Onboarding';
import SearchPage from '../features/search/pages/SearchPage';
import NotificationsPage from '../features/notifications/pages/NotificationsPage';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLogin from '../features/admin/pages/AdminLogin';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminUsers from '../features/admin/pages/AdminUsers';
import AdminProperties from '../features/admin/pages/AdminProperties';
import AdminPosts from '../features/admin/pages/AdminPosts';
import AdminPayments from '../features/admin/pages/AdminPayments';
import AdminConversations from '../features/admin/pages/AdminConversations';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/request-reset" element={<RequestReset />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/create-new-password" element={<ResetPassword />} />
      <Route path="/reset-success" element={<PasswordResetSuccess />} />
      <Route path="/access-restricted" element={<AccessRestricted />} />
      <Route path="/terms" element={<LayoutWrapper><Terms /></LayoutWrapper>} />
      <Route path="/privacy" element={<LayoutWrapper><Privacy /></LayoutWrapper>} />
      <Route path="/about" element={<LayoutWrapper><About /></LayoutWrapper>} />
      <Route path="/support" element={<LayoutWrapper><Support /></LayoutWrapper>} />
      <Route path="/security" element={<LayoutWrapper><Security /></LayoutWrapper>} />
      <Route path="/careers" element={<LayoutWrapper><Careers /></LayoutWrapper>} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/search" element={<LayoutWrapper><SearchPage /></LayoutWrapper>} />
      <Route path="/properties" element={<LayoutWrapper><SearchPage /></LayoutWrapper>} />
      <Route path="/properties/:propertyId" element={<LayoutWrapper><PropertyDetails /></LayoutWrapper>} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <LayoutWrapper><FavoritesPage /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <LayoutWrapper><ChatPage /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <LayoutWrapper><BookingPage /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/profile"
        element={
          <ProtectedRoute>
            <LayoutWrapper><OwnerProfile /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute>
            <LayoutWrapper><StudentProfile /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutWrapper><StudentHome /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <LayoutWrapper><StudentHome /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/home"
        element={
          <ProtectedRoute>
            <LayoutWrapper><OwnerHome /></LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts/:postId"
        element={
          <ProtectedRoute>
            <LayoutWrapper><PostDetails /></LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <LayoutWrapper><NotificationsPage /></LayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
      <Route path="/admin/properties" element={<AdminProtectedRoute><AdminProperties /></AdminProtectedRoute>} />
      <Route path="/admin/posts" element={<AdminProtectedRoute><AdminPosts /></AdminProtectedRoute>} />
      <Route path="/admin/payments" element={<AdminProtectedRoute><AdminPayments /></AdminProtectedRoute>} />
      <Route path="/admin/conversations" element={<AdminProtectedRoute><AdminConversations /></AdminProtectedRoute>} />

      <Route path="*" element={<LayoutWrapper><NotFound /></LayoutWrapper>} />
    </Routes>
  );
};

export default AppRoutes;
