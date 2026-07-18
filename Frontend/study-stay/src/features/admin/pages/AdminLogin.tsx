import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin', { replace: true });
    } catch (submitError: unknown) {
      const messageText =
        (submitError as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'بيانات الاعتماد غير صحيحة';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase text-center">حُجرة</p>
        <h1 className="font-headline text-2xl font-black text-center mt-2 mb-8">تسجيل دخول الإدارة</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold text-slate-600">
            البريد الإلكتروني
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="admin@hojra.com"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            كلمة المرور
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
