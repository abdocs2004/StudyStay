import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'لوحة التحكم', icon: 'dashboard', exact: true },
  { to: '/admin/users', label: 'المستخدمون', icon: 'group' },
  { to: '/admin/properties', label: 'العقارات', icon: 'apartment' },
  { to: '/admin/posts', label: 'طلبات السكن', icon: 'assignment' },
  { to: '/admin/payments', label: 'المدفوعات', icon: 'payments' },
  { to: '/admin/conversations', label: 'مراقبة المحادثات', icon: 'forum' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shrink-0 shadow-md relative z-30">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:text-indigo-400 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">{isSidebarOpen ? 'close' : 'menu'}</span>
          </button>
          <span className="font-headline text-lg font-black">لوحة الإدارة</span>
        </div>
        <p className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">حُجرة</p>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="hidden md:block px-6 py-6 border-b border-white/10">
          <p className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">حُجرة</p>
          <h1 className="font-headline text-xl font-black mt-1">لوحة الإدارة</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive(item.to, item.exact)
                  ? 'bg-primary text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 mt-auto">
          <p className="text-sm font-bold truncate">{user?.name}</p>
          <p className="text-xs text-white/50 mb-3 truncate">{user?.email}</p>
          <button
            type="button"
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            className="w-full rounded-full border border-white/20 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
