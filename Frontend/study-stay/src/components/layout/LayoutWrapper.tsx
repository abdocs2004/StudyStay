import React, { type ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import GuestLayout from './GuestLayout';
import StudentLayout from './StudentLayout';
import OwnerLayout from './OwnerLayout';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <GuestLayout>{children}</GuestLayout>;
  }

  if (user?.role === 'owner') {
    return <OwnerLayout>{children}</OwnerLayout>;
  }

  return <StudentLayout>{children}</StudentLayout>;
};

export default LayoutWrapper;
