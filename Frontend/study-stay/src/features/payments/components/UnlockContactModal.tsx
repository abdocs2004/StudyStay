import React, { useEffect, useState } from 'react';
import { createPaymentRequest, getPaymentConfig, type PaymentMethod, type PaymentConfig } from '../payment.service';

interface UnlockContactModalProps {
  targetUserId: number;
  targetName?: string;
  propertyId?: number;
  postId?: number;
  rent?: number;
  onClose: () => void;
  onSubmitted: () => void;
}

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'vodafone_cash', label: 'فودافون كاش' },
  { value: 'etisalat_cash', label: 'اتصالات كاش' },
  { value: 'instapay', label: 'إنستاباي' },
];

const UnlockContactModal: React.FC<UnlockContactModalProps> = ({
  targetUserId,
  targetName,
  propertyId,
  postId,
  rent,
  onClose,
  onSubmitted,
}) => {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('vodafone_cash');
  const [reference, setReference] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await getPaymentConfig();
        setConfig(data);
      } catch (configError) {
        console.error('Error loading payment config:', configError);
      }
    };
    loadConfig();
  }, []);

  const commissionRate = config?.commissionRate ?? 0.025;
  const commission = rent ? Math.round(rent * commissionRate * 100) / 100 : null;
  const activeMethodInfo = config?.methods?.[method];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof) {
      setError('الرجاء رفع صورة إيصال الدفع');
      return;
    }
    if (!senderPhone) {
      setError('الرجاء إدخال رقم الهاتف الذي تم التحويل منه');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createPaymentRequest({
        target_user_id: targetUserId,
        property_id: propertyId,
        post_id: postId,
        payment_method: method,
        base_rent: rent,
        transaction_reference: reference || undefined,
        sender_phone: senderPhone,
        proof,
      });
      setDone(true);
      onSubmitted();
    } catch (submitError: unknown) {
      const messageText =
        (submitError as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'حدث خطأ أثناء إرسال طلب الدفع';
      setError(messageText);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-5xl text-emerald-500">task_alt</span>
            <h3 className="font-headline text-xl font-bold mt-4">تم إرسال طلبك</h3>
            <p className="text-sm text-on-surface-variant mt-2">
              سيقوم فريق الإدارة بمراجعة طلبك، وستصلك رسالة عند فتح بيانات التواصل{targetName ? ` مع ${targetName}` : ''}.
            </p>
            <button onClick={onClose} className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white">
              حسناً
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-headline text-xl font-bold mb-1">🔒 فتح بيانات التواصل</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              ادفع عمولة الخدمة ليتم فتح رقم الهاتف والبريد الإلكتروني والعنوان الكامل
              {targetName ? ` الخاصة بـ ${targetName}` : ''} بعد موافقة الإدارة.
            </p>

            {rent && (
              <div className="rounded-2xl bg-slate-50 p-4 mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">الإيجار</span><span className="font-bold">{rent.toLocaleString('en-US')} ج.م</span></div>
                <div className="flex justify-between"><span className="text-slate-500">عمولة المنصة ({(commissionRate * 100).toFixed(1)}%)</span><span className="font-bold">{commission} ج.م</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5"><span className="font-bold text-slate-700">المبلغ المطلوب تحويله</span><span className="font-black text-primary">{commission} ج.م</span></div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-2">طريقة الدفع</p>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMethod(m.value)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                        method === m.value ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {activeMethodInfo?.number && (
                  <p className="mt-2 text-xs text-slate-500">
                    حوّل المبلغ إلى: <span className="font-bold font-mono text-slate-800">{activeMethodInfo.number}</span>
                  </p>
                )}
              </div>

              <label className="block text-xs font-semibold text-on-surface-variant">
                رقم الهاتف المُحوَّل منه
                <input
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-on-surface-variant">
                رقم العملية / المرجع
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  placeholder="مثال: 123456789"
                />
              </label>

              <label className="block text-xs font-semibold text-on-surface-variant">
                صورة إيصال الدفع
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProof(e.target.files?.[0] || null)}
                  className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs outline-none"
                  required
                />
              </label>

              {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال طلب الفتح'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UnlockContactModal;
