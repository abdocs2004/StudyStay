import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getUsers,
  suspendUser,
  activateUser,
  deleteUser,
  resetUserPassword,
  type AdminUser,
} from '../admin.service';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [tempPassword, setTempPassword] = useState<{ userId: number; password: string } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers({ search: search || undefined, role: role || undefined });
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  const handleSuspendToggle = async (u: AdminUser) => {
    try {
      if (u.is_suspended) {
        await activateUser(u.id);
      } else {
        await suspendUser(u.id);
      }
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, is_suspended: !u.is_suspended } : item)));
    } catch (error) {
      console.error('Error toggling suspension:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع.')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      window.alert('حدث خطأ أثناء حذف المستخدم.');
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!window.confirm('سيتم إنشاء كلمة مرور مؤقتة جديدة لهذا المستخدم. هل تريد المتابعة؟')) return;
    try {
      const result = await resetUserPassword(id);
      setTempPassword({ userId: id, password: result.temporaryPassword });
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-headline text-2xl font-black text-slate-900">إدارة المستخدمين</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none w-64"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
            >
              <option value="">كل الأدوار</option>
              <option value="student">طالب</option>
              <option value="owner">مالك</option>
              <option value="admin">مشرف</option>
            </select>
          </div>
        </div>

        {tempPassword && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            تم إنشاء كلمة مرور مؤقتة للمستخدم #{tempPassword.userId}: <strong className="font-mono">{tempPassword.password}</strong>
            {' '}— شاركها مع المستخدم لمرة واحدة فقط.
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">البريد الإلكتروني</th>
                <th className="px-4 py-3">الدور</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">تاريخ التسجيل</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">جاري التحميل...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">لا يوجد مستخدمون</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-slate-800">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.is_suspended ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {u.is_suspended ? 'معلّق' : 'نشط'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleSuspendToggle(u)}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50"
                        >
                          {u.is_suspended ? 'تفعيل' : 'تعليق'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u.id)}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50"
                        >
                          إعادة تعيين كلمة المرور
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
