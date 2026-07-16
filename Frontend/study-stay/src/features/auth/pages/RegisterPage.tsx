import React from 'react';
import AuthFooter from '../components/AuthFooter';
import AuthHeader from '../components/AuthHeader';
import RegisterForm from '../components/RegisterForm';
import RegisterShowcase from '../components/RegisterShowcase';

const RegisterPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[45%] lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <AuthHeader />
            <div className="rounded-4x1 border border-slate-200 bg-slate-50/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8">
              <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 text-sm font-bold text-white">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">بيانات الحساب</p>
                    <p className="text-xs text-slate-500">الخطوة 1 من 2</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <div className="h-px w-10 bg-slate-200" />
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                </div>
              </div>

              <RegisterForm />
            </div>
            <AuthFooter />
          </div>
        </section>

        <RegisterShowcase />
      </div>
    </main>
  );
};

export default RegisterPage;
