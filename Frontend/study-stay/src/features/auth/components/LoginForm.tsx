import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('من فضلك أدخل البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'owner') {
        navigate('/owner/home');
      } else {
        // Students go directly to the search/listings page after login
        navigate('/search');
      }
    } catch (error: unknown) {
      console.error(error);
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {errorMessage ? (
        <div className="mb-6 flex items-start gap-3 p-4 bg-error-container text-on-surface rounded-xl text-sm leading-relaxed">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">البريد الإلكتروني</label>
        <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-outline transition-all"
            />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-sm font-semibold text-on-surface" htmlFor="password">كلمة المرور</label>
            <Link to="/request-reset" className="text-xs font-semibold text-primary hover:underline transition-all">نسيت كلمة المرور؟</Link>
        </div>
        <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-outline transition-all"
            />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>
      </div>

      <div className="pt-4">
          <button 
            disabled={loading}
            className="w-full bg-[#3d2fd4] text-white py-3 rounded-xl text-[18px] font-bold tracking-wide shadow-[0_18px_36px_rgba(61,47,212,0.28)] hover:-translate-y-0.5 transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed" 
            type="submit"
          >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-on-surface-variant text-sm">ليس لديك حساب؟ <Link to="/register" className="text-primary font-bold hover:underline ml-1">إنشاء حساب</Link></p>
      </div>
    </form>
  );
};

export default LoginForm;
