import React from 'react';
import { Link } from 'react-router-dom';

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f5ff] font-body text-on-surface antialiased overflow-hidden">
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(84,74,255,0.08),transparent_36%)]" />

        <div className="relative z-10 w-full max-w-147.5 rounded-4x1 bg-white px-8 py-10 md:px-14 md:py-12 shadow-[0_18px_40px_rgba(42,34,118,0.08)] border border-[#ece8ff] text-center">
          <div className="relative flex justify-center pt-2 pb-9">
            <div className="absolute -top-1 right-[40%] flex items-center gap-1 text-[#4f41e6] translate-x-10">
              <span className="text-[13px] font-semibold tracking-[0.18em]">A</span>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 -ml-1" aria-hidden="true">
                <path d="M12 3c2.5 3.2 3.5 5.3 3.5 7.5a3.5 3.5 0 0 1-7 0C8.5 8.3 9.5 6.2 12 3Z" fill="currentColor" />
              </svg>
              <span className="text-[13px] font-semibold tracking-[0.18em]">RK</span>
            </div>

            <div className="h-32 w-32 rounded-full bg-[#58ff79] flex items-center justify-center shadow-[0_0_0_2px_rgba(88,255,121,0.08)]">
              <div className="h-16 w-16 rounded-full bg-[#006d3d] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9" aria-hidden="true">
                  <path d="M6.8 12.5l3.2 3.2 7.2-7.4" stroke="#7dff9f" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-[48px] leading-[0.98] md:text-[56px] font-black tracking-[-0.04em] text-[#0f1d3a]">
            تمت إعادة تعيين
            <br />
            كلمة المرور بنجاح
          </h1>

          <p className="mt-8 text-[22px] leading-[1.48] text-[#374a66] max-w-115 mx-auto">
            تم تحديث كلمة المرور الخاصة بك. يمكنك الآن تسجيل الدخول بالبيانات الجديدة.
          </p>

          <div className="mt-16 max-w-125 mx-auto">
            <Link
              className="group inline-flex w-full items-center justify-center rounded-[18px] bg-[#4a40e3] px-8 py-5 text-[20px] font-bold text-white shadow-[0_16px_24px_rgba(74,64,227,0.28)] transition-transform duration-200 hover:-translate-y-0.5"
              to="/login"
            >
              <span>الذهاب لتسجيل الدخول</span>
              <svg viewBox="0 0 24 24" fill="none" className="ml-4 h-8 w-8 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                <path d="M5 12h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <p className="mt-14 text-[18px] text-[#6e768c]">
            تحتاج مساعدة؟{' '}
            <a className="font-semibold text-[#4a40e3] hover:underline underline-offset-4" href="#">
              تواصل مع الدعم
            </a>
          </p>
        </div>

        <div className="mt-12 w-full max-w-147.5 overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(42,34,118,0.10)]">
          <img
            alt="Reset success illustration"
            className="block h-62.5 w-full object-cover"
            src="/images/successfull-resete.png"
          />
        </div>
      </main>

      <footer className="w-full bg-white border-t border-[#eef0f7] py-10">
        <div className="mx-auto flex max-w-400 flex-col gap-6 px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[22px] font-bold text-[#0f1d3a]">The Sanctuary</div>
            <div className="mt-2 text-[14px] text-[#6e768c]">© 2024 حُجرة. جميع الحقوق محفوظة.</div>
          </div>

          <nav className="flex flex-wrap gap-10 text-[18px] text-[#6e768c] md:pb-1">
            <a className="transition-colors hover:text-[#4a40e3]" href="#">سياسة الخصوصية</a>
            <a className="transition-colors hover:text-[#4a40e3]" href="#">شروط الخدمة</a>
            <a className="transition-colors hover:text-[#4a40e3]" href="#">الدعم</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PasswordResetSuccess;