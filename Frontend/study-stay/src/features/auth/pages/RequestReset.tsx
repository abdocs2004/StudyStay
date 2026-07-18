import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RequestReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
      <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl shadow-sm h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-indigo-600 font-headline">The Sanctuary</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-indigo-50/50 transition-colors text-on-surface-variant" type="button">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m.5-13h-1v6l5.2 3.1.7-1.2-5-3v-4.9z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="grow flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-130 z-10">
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary font-label">الخطوة 1 من 3</span>
            </div>
            <div className="flex gap-1.5">
              <div className="h-1.5 w-8 rounded-full bg-primary" />
              <div className="h-1.5 w-8 rounded-full bg-primary-fixed-dim" />
              <div className="h-1.5 w-8 rounded-full bg-primary-fixed-dim" />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-4x1 p-8 md:p-10 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <div className="mb-8">
              <h1 className="text-[32px] font-bold font-headline text-on-surface tracking-tight mb-4">إعادة تعيين كلمة المرور</h1>
              <p className="text-[18px] leading-[1.45] text-on-surface-variant">أدخل بريدك الإلكتروني وسنرسل لك رمزًا لإعادة تعيين كلمة المرور.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant font-label px-1" htmlFor="email">
                  البريد الإلكتروني
                </label>
                <input
                  className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-fixed-dim rounded-[18px] py-4 pl-4 pr-4 transition-all placeholder:text-outline"
                  id="email"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                />
              </div>

              <button
                className="w-full text-white font-semibold py-4.5 rounded-[18px] shadow-[0_12px_24px_rgba(53,37,205,0.28)] hover:opacity-90 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 text-[17px]"
                style={{ backgroundColor: '#4b41e2' }}
                type="submit"
              >
                إرسال الرمز
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M13 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="mt-10 text-center">
              <Link className="text-[15px] font-semibold hover:underline decoration-2 underline-offset-4" style={{ color: '#3525cd' }} to="/login">
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center opacity-20 pointer-events-none select-none flex justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-24 w-24">
              <path d="M12 1l-1.5 5.5L5 7l5.5 1.5L12 14l1.5-5.5L19 7l-5.5-1.5L12 1z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 bg-surface border-t border-indigo-100/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="text-lg font-bold text-on-surface font-headline">The Sanctuary</div>
          <div className="text-slate-500 text-sm font-body">© 2024 حُجرة. جميع الحقوق محفوظة.</div>
          <div className="flex gap-6">
            <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
              سياسة الخصوصية
            </a>
            <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
              شروط الخدمة
            </a>
            <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
              الدعم
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RequestReset;
