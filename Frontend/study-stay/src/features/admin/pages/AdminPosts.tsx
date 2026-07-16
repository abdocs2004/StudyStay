import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAdminPosts, approvePost, rejectPost, adminDeletePost, type AdminPost } from '../admin.service';

const STATUS_LABELS: Record<string, string> = { pending: 'معلّق', approved: 'معتمد', rejected: 'مرفوض' };
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
};

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getAdminPosts(statusFilter || undefined);
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    try {
      await approvePost(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, approval_status: 'approved', rejection_reason: null } : p)));
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectPost(id, rejectReason);
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, approval_status: 'rejected', rejection_reason: rejectReason } : p)));
      setRejectingId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل تريد حذف هذا الطلب نهائياً؟')) return;
    try {
      await adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-headline text-2xl font-black text-slate-900">إدارة طلبات السكن</h2>
          <div className="flex gap-2">
            {['', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  statusFilter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s ? STATUS_LABELS[s] : 'الكل'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-slate-400">جاري التحميل...</p>
          ) : posts.length === 0 ? (
            <p className="text-slate-400">لا توجد طلبات</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-800">{post.university} · {post.city}</h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLORS[post.approval_status]}`}>
                    {STATUS_LABELS[post.approval_status]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">الميزانية: {post.budget} ج.م</p>
                <p className="text-xs text-slate-500 mb-3">الطالب: {post.student_name} ({post.student_email})</p>

                {post.rejection_reason && (
                  <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2 mb-3">سبب الرفض: {post.rejection_reason}</p>
                )}

                {rejectingId === post.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="سبب الرفض..."
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none min-h-[70px]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(post.id)}
                        className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                      >
                        تأكيد الرفض
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setRejectReason(''); }}
                        className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {post.approval_status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        موافقة
                      </button>
                    )}
                    {post.approval_status !== 'rejected' && (
                      <button
                        onClick={() => setRejectingId(post.id)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        رفض
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;
