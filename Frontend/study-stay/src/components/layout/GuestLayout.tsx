import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      <Navbar variant="guest" />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;
