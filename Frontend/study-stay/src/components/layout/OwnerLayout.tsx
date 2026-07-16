import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface OwnerLayoutProps {
  children: ReactNode;
}

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      <Navbar variant="owner" />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default OwnerLayout;
