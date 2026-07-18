import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

interface NavbarProps {
  variant: 'guest' | 'student' | 'owner';
}

const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderGuestLinks = (isMobile = false) => (
    <>
      <Link to="/" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الرئيسية
      </Link>
      <Link to="/search" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        العقارات
      </Link>
      <Link to="/login" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        تسجيل الدخول
      </Link>
      <Link to="/register" className={`rounded-full bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary/90 transition-colors ${isMobile ? 'block mt-4 text-center' : ''}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        تسجيل
      </Link>
    </>
  );

  const renderStudentLinks = (isMobile = false) => (
    <>
      <Link to="/home" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الرئيسية
      </Link>
      <Link to="/properties" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الشقق
      </Link>
      <Link to="/favorites" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        المفضلة
      </Link>
      <Link to="/messages" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الرسائل
      </Link>
      {!isMobile && <NotificationBell />}
      <Link to="/student/profile" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الملف الشخصي
      </Link>
      <button type="button" onClick={() => { logout(); if (isMobile) setIsMobileMenuOpen(false); }} className={`text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors ${isMobile ? 'block w-full text-right py-3' : ''}`}>
        تسجيل الخروج
      </button>
    </>
  );

  const renderOwnerLinks = (isMobile = false) => (
    <>
      <Link to="/owner/home" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        طلبات الطلاب
      </Link>
      <Link to="/owner/profile" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        عقاراتي
      </Link>
      <Link to="/favorites" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الطلبات المفضلة
      </Link>
      <Link to="/messages" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الرسائل
      </Link>
      {!isMobile && <NotificationBell />}
      <Link to="/owner/profile" className={`text-sm font-medium hover:text-primary transition-colors ${isMobile ? 'block py-3 border-b border-slate-100 text-slate-700' : 'text-slate-600'}`} onClick={() => isMobile && setIsMobileMenuOpen(false)}>
        الملف الشخصي
      </Link>
      <button type="button" onClick={() => { logout(); if (isMobile) setIsMobileMenuOpen(false); }} className={`text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors ${isMobile ? 'block w-full text-right py-3' : ''}`}>
        تسجيل الخروج
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-container-high bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <Link to="/" className="text-2xl font-headline font-black tracking-tight text-primary">
            حُجرة
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {variant === 'guest' && renderGuestLinks()}
          {variant === 'student' && isAuthenticated && renderStudentLinks()}
          {variant === 'owner' && isAuthenticated && renderOwnerLinks()}
          {variant !== 'guest' && !isAuthenticated && renderGuestLinks()}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg border-t border-slate-100 p-4 font-body">
          {variant === 'guest' && renderGuestLinks(true)}
          {variant === 'student' && isAuthenticated && renderStudentLinks(true)}
          {variant === 'owner' && isAuthenticated && renderOwnerLinks(true)}
          {variant !== 'guest' && !isAuthenticated && renderGuestLinks(true)}
        </div>
      )}
    </header>
  );
};

export default Navbar;
