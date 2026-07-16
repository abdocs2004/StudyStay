import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

interface NavbarProps {
  variant: 'guest' | 'student' | 'owner';
}

const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const { isAuthenticated, logout } = useAuth();

  const renderGuestLinks = () => (
    <>
      <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الرئيسية
      </Link>
      <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        العقارات
      </Link>
      <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        تسجيل الدخول
      </Link>
      <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
        تسجيل
      </Link>
    </>
  );

  const renderStudentLinks = () => (
    <>
      <Link to="/home" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الرئيسية
      </Link>
      <Link to="/properties" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
  الشقق
</Link>
      <Link to="/favorites" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        المفضلة
      </Link>
      <Link to="/messages" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الرسائل
      </Link>
      <NotificationBell />
      <Link to="/student/profile" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الملف الشخصي
      </Link>
      <button onClick={logout} className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors">
        تسجيل الخروج
      </button>
    </>
  );

  const renderOwnerLinks = () => (
    <>
      <Link to="/owner/home" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        طلبات الطلاب
      </Link>
      <Link to="/owner/profile" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        عقاراتي
      </Link>
      <Link to="/favorites" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الطلبات المفضلة
      </Link>
      <Link to="/messages" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الرسائل
      </Link>
      <NotificationBell />
      <Link to="/owner/profile" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
        الملف الشخصي
      </Link>
      <button onClick={logout} className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors">
        تسجيل الخروج
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-container-high bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-black tracking-tight text-primary">
          StudyStay
        </Link>

        <nav className="flex items-center gap-6">
          {variant === 'guest' && renderGuestLinks()}
          {variant === 'student' && isAuthenticated && renderStudentLinks()}
          {variant === 'owner' && isAuthenticated && renderOwnerLinks()}
          {variant !== 'guest' && !isAuthenticated && renderGuestLinks()}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
