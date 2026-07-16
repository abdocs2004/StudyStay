import React from 'react';
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

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-slate-100 flex" dir="rtl">
      <aside className="w-64 shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">StudyStay</p>
          <h1 className="font-headline text-xl font-black mt-1">لوحة الإدارة</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
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
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-sm font-bold">{user?.name}</p>
          <p className="text-xs text-white/50 mb-3">{user?.email}</p>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-full border border-white/20 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
