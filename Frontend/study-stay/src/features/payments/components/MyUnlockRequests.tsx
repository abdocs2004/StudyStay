import React, { useEffect, useState } from 'react';
import { getMyPaymentRequests, type MyPaymentRequest } from '../payment.service';

const STATUS_LABELS: Record<string, string> = { pending: 'قيد المراجعة', approved: 'تم الفتح', rejected: 'مرفوض' };
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  approved: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
};

const MyUnlockRequests: React.FC = () => {
  const [requests, setRequests] = useState<MyPaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPaymentRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error loading payment requests:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
      <h3 className="font-headline text-lg font-bold mb-4">طلبات فتح بيانات التواصل</h3>
      <ul className="space-y-2">
        {requests.slice(0, 5).map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm">
            <div>
              <p className="font-semibold text-slate-800">{r.target_name}</p>
              <p className="text-xs text-slate-400">{r.amount} ج.م · {new Date(r.created_at).toLocaleDateString('ar-EG')}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[r.status]}`}>
              {STATUS_LABELS[r.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MyUnlockRequests;
