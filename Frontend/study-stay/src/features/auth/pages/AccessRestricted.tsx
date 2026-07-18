import React from 'react';
import { Link } from 'react-router-dom';

const AccessRestricted: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
        <div className="flex items-center gap-8">
          <a className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-headline tracking-tight" href="/">
            The Curated Sanctuary
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 font-semibold tracking-tight transition-all duration-300" href="/">
              تصفح
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 font-semibold tracking-tight transition-all duration-300" href="/">
              مساكن موثقة
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-500 font-semibold tracking-tight transition-all duration-300" href="/">
              الدعم
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            className="px-5 py-2 text-indigo-600 dark:text-indigo-400 font-semibold tracking-tight hover:opacity-80 transition-all duration-300 active:scale-95"
            to="/login"
          >
            تسجيل الدخول
          </Link>
          <Link
            className="px-6 py-2.5 bg-linear-to-br from-primary-600 to-primary text-white rounded-xl font-semibold tracking-tight shadow-[0_12px_32px_rgba(20,27,43,0.06)] hover:opacity-90 transition-all duration-300 active:scale-95"
            to="/register"
          >
            إنشاء حساب
          </Link>
        </div>
      </header>

      {/* Main Content: Access Denied Canvas */}
      <main className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Asymmetric Illustration Section */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3 scale-105 transition-transform group-hover:rotate-0 duration-500" />
            <div className="relative bg-surface-container-lowest p-4 rounded-3xl shadow-[0_12px_32px_rgba(20,27,43,0.06)] overflow-hidden">
              <img
                alt="Restricted Access Illustration"
                className="w-full h-100 object-cover rounded-2xl"
                src="/images/access-restricted.png"
              />
              <div className="absolute top-8 right-8 bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-primary">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16h4v2h-4zm0-5h4v4h-4zm0-5h4v4h-4z" />
                </svg>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary-container rounded-full mix-blend-multiply opacity-50 blur-2xl" />
          </div>

          {/* Content Section */}
          <div className="flex flex-col space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase">
                يتطلب توثيق الهوية
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold font-headline text-on-surface tracking-tight leading-[1.1]">
                الوصول مقيّد
              </h1>
              <p className="text-lg lg:text-xl text-on-surface-variant font-body leading-relaxed max-w-md">
                يبدو أنك لا تملك صلاحية الوصول لهذه الصفحة. سجّل الدخول بالحساب الصحيح أو ارجع إلى الصفحة الرئيسية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                className="inline-flex items-center justify-center px-8 py-4 bg-linear-to-br from-primary-600 to-primary text-white rounded-xl font-headline font-bold text-lg shadow-[0_12px_32px_rgba(20,27,43,0.06)] hover:opacity-90 transition-all duration-300 active:scale-95"
                to="/"
              >
                العودة للرئيسية
              </Link>
              <Link
                className="inline-flex items-center justify-center px-8 py-4 bg-surface-container-high text-primary rounded-xl font-headline font-bold text-lg hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
                to="/login"
              >
                تسجيل الدخول
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-outline-variant/20">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="/images/unnamed (1).png"
                  alt="Student 1"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="/images/unnamed (2).png"
                  alt="Student 2"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  src="/images/unnamed (3).png"
                  alt="Student 3"
                />
              </div>
              <p className="text-sm text-on-surface-variant font-medium">
                انضم إلى أكثر من <span className="text-primary font-bold">12,000</span> طالب موثق في مجتمعنا.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12 px-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <span className="font-headline font-bold text-slate-900 dark:text-slate-100">The Curated Sanctuary</span>
          <p className="font-body text-sm text-slate-500 dark:text-slate-400">© 2024 حُجرة. جميع الحقوق محفوظة.</p>
        </div>
        <div className="flex gap-8">
          <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-body text-sm" href="#">
            سياسة الخصوصية
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-body text-sm" href="#">
            شروط الخدمة
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-body text-sm" href="#">
            مركز المساعدة
          </a>
          <a className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-body text-sm" href="#">
            تواصل معنا
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AccessRestricted;
