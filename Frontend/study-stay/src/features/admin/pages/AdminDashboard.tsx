import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import { getAdminStats, getRecentActivity, type AdminStats } from '../admin.service';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<Awaited<ReturnType<typeof getRecentActivity>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, activityData] = await Promise.all([getAdminStats(), getRecentActivity()]);
        setStats(statsData);
        setActivity(activityData);
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const approvalBar = (approved: number, pending: number, rejected: number) => {
    const total = approved + pending + rejected || 1;
    return (
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="bg-emerald-500" style={{ width: `${(approved / total) * 100}%` }} />
        <div className="bg-amber-400" style={{ width: `${(pending / total) * 100}%` }} />
        <div className="bg-rose-500" style={{ width: `${(rejected / total) * 100}%` }} />
      </div>
    );
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="animate-pulse text-slate-400 font-semibold">جاري تحميل الإحصائيات...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="font-headline text-2xl font-black text-slate-900">نظرة عامة</h2>
          <p className="text-sm text-slate-500 mt-1">إحصائيات شاملة عن نشاط المنصة</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="إجمالي المستخدمين" value={stats.users.total_users} icon="group" />
          <StatCard label="الطلاب" value={stats.users.students} icon="school" accent="bg-blue-50 text-blue-600" />
          <StatCard label="الملاك" value={stats.users.owners} icon="home" accent="bg-purple-50 text-purple-600" />
          <StatCard label="المشرفون" value={stats.users.admins} icon="shield_person" accent="bg-slate-100 text-slate-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">العقارات</h3>
              <Link to="/admin/properties" className="text-xs font-semibold text-primary hover:underline">إدارة</Link>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-3">{stats.properties.total_properties}</p>
            {approvalBar(stats.properties.approved_properties, stats.properties.pending_properties, stats.properties.rejected_properties)}
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>معتمد {stats.properties.approved_properties}</span>
              <span>معلّق {stats.properties.pending_properties}</span>
              <span>مرفوض {stats.properties.rejected_properties}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">طلبات السكن</h3>
              <Link to="/admin/posts" className="text-xs font-semibold text-primary hover:underline">إدارة</Link>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-3">{stats.posts.total_posts}</p>
            {approvalBar(stats.posts.approved_posts, stats.posts.pending_posts, stats.posts.rejected_posts)}
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>معتمد {stats.posts.approved_posts}</span>
              <span>معلّق {stats.posts.pending_posts}</span>
              <span>مرفوض {stats.posts.rejected_posts}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">المدفوعات</h3>
              <Link to="/admin/payments" className="text-xs font-semibold text-primary hover:underline">إدارة</Link>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stats.payments.total_payments}</p>
            <p className="text-xs text-slate-500 mb-3">الإيرادات المعتمدة: {stats.payments.revenue} ج.م</p>
            {approvalBar(stats.payments.approved_payments, stats.payments.pending_payments, stats.payments.rejected_payments)}
            <div className="flex justify-between text-[11px] text-slate-500 mt-2">
              <span>معتمد {stats.payments.approved_payments}</span>
              <span>معلّق {stats.payments.pending_payments}</span>
              <span>مرفوض {stats.payments.rejected_payments}</span>
            </div>
          </div>
        </div>

        {activity && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">أحدث المستخدمين</h3>
              <ul className="space-y-3">
                {activity.recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{u.name}</span>
                    <span className="text-xs text-slate-400">{u.role}</span>
                  </li>
                ))}
                {activity.recentUsers.length === 0 && <p className="text-xs text-slate-400">لا يوجد نشاط بعد</p>}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">أحدث العقارات</h3>
              <ul className="space-y-3">
                {activity.recentProperties.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 truncate">{p.title}</span>
                    <span className="text-xs text-slate-400">{p.approval_status}</span>
                  </li>
                ))}
                {activity.recentProperties.length === 0 && <p className="text-xs text-slate-400">لا يوجد نشاط بعد</p>}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">أحدث المدفوعات</h3>
              <ul className="space-y-3">
                {activity.recentPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{p.payer_name}</span>
                    <span className="text-xs text-slate-400">{p.amount} ج.م · {p.status}</span>
                  </li>
                ))}
                {activity.recentPayments.length === 0 && <p className="text-xs text-slate-400">لا يوجد نشاط بعد</p>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
