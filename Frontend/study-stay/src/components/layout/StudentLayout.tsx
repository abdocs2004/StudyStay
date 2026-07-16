import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface antialiased">
      <Navbar variant="student" />
      <main className="pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;
