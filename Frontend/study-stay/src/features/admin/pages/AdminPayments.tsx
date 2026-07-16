import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getAdminPayments, approvePayment, rejectPayment, type AdminPayment } from '../admin.service';
import { resolveImageUrl } from '../../../utils/imageUrl';

const STATUS_LABELS: Record<string, string> = { pending: 'معلّق', approved: 'معتمد', rejected: 'مرفوض' };
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
};
const METHOD_LABELS: Record<string, string> = {
  instapay: 'إنستاباي',
  vodafone_cash: 'فودافون كاش',
  orange_cash: 'أورانج كاش',
  etisalat_cash: 'اتصالات كاش',
};

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await getAdminPayments(statusFilter || undefined);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    try {
      await approvePayment(id);
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p)));
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  const handleReject = async (id: number) => {
    const notes = window.prompt('سبب الرفض (اختياري):') || undefined;
    try {
      await rejectPayment(id, notes);
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p)));
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-headline text-2xl font-black text-slate-900">إدارة طلبات الدفع</h2>
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

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-right text-xs text-slate-500">
                <th className="px-4 py-3">مقدّم الطلب</th>
                <th className="px-4 py-3">لفتح بيانات</th>
                <th className="px-4 py-3">الإيجار / العمولة</th>
                <th className="px-4 py-3">الطريقة</th>
                <th className="px-4 py-3">هاتف المُحوِّل</th>
                <th className="px-4 py-3">المرجع</th>
                <th className="px-4 py-3">الإيصال</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">جاري التحميل...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">لا توجد طلبات دفع</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{p.payer_name}</p>
                      <p className="text-xs text-slate-400">{p.payer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{p.target_name}</p>
                      {p.property_title && <p className="text-xs text-slate-400">{p.property_title}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{p.amount} ج.م</p>
                      {p.base_rent ? <p className="text-[11px] text-slate-400">إيجار {p.base_rent} ج.م · {((p.commission_rate || 0) * 100).toFixed(1)}%</p> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{METHOD_LABELS[p.payment_method] || p.payment_method}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">{p.sender_phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">{p.transaction_reference || '—'}</td>
                    <td className="px-4 py-3">
                      {p.payment_proof ? (
                        <button
                          onClick={() => setPreviewImage(resolveImageUrl(p.payment_proof))}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          عرض الإيصال
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[p.status]}`}>
                        {STATUS_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            موافقة
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="إيصال الدفع" className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPayments;
