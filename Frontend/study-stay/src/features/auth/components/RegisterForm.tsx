import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type UserRole = 'student' | 'owner';

type RoleOption = {
  id: UserRole;
  label: string;
  icon: string;
};

const roleOptions: RoleOption[] = [
  { id: 'student', label: 'طالب', icon: 'school' },
  { id: 'owner', label: 'مالك', icon: 'home' },
];

const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
  if (name === 'school') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <path d="M12 3L2.5 7.5L12 12L21.5 7.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 10V16.2C5 17.3 8.1 19.5 12 19.5C15.9 19.5 19 17.3 19 16.2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 20V9L12 4L20 9V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 20V13H15V20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M2.5 20.5H21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('من فضلك املأ جميع الحقول المطلوبة.');
      return;
    }

    if (selectedRole === 'student' && !university.trim()) {
      setErrorMessage('من فضلك أدخل اسم الجامعة الخاصة بك.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const data = await register({
        name,
        phone,
        email,
        password,
        role: selectedRole,
        university: selectedRole === 'student' ? university : null,
      });

      if (data.user.role === 'owner') {
        navigate('/owner/home');
      } else {
        navigate('/home');
      }
    } catch (error: unknown) {
      console.error(error);
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-headline text-2xl font-bold text-slate-900">أنشئ حسابك</h2>
        <p className="mt-2 text-sm text-slate-500">اختر إن كنت طالبًا أو مالك عقار ثم أكمل البيانات الأساسية.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {roleOptions.map((role) => {
          const isActive = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 ${
                isActive ? 'border-primary bg-white shadow-[0_12px_32px_rgba(20,27,43,0.08)]' : 'border-slate-200 bg-white/80 opacity-75 hover:opacity-100'
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon name={role.icon} className="h-5 w-5" />
              </span>
              <span className={`text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                {role.label}
              </span>
            </button>
          );
        })}
      </div>

      {errorMessage ? (
        <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm leading-relaxed border border-rose-100">
          <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="الاسم الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-transparent bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-primary/20 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              رقم الهاتف
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+20 10 0000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-transparent bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-primary/20 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="alex@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-primary/20 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {selectedRole === 'student' && (
          <div className="space-y-1.5 animate-fadeIn">
            <label htmlFor="university" className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              الجامعة
            </label>
            <input
              id="university"
              name="university"
              type="text"
              required
              placeholder="مثال: جامعة القاهرة"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-xl border border-transparent bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-primary/20 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            كلمة المرور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-primary/20 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 py-3 font-headline text-sm font-bold text-white shadow-[0_12px_32px_rgba(20,27,43,0.12)] transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-slate-500">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="font-bold text-primary transition hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
