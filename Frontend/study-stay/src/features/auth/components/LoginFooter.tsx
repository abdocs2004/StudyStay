import React from 'react';

const LoginFooter: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-50 py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-8 md:flex-row">
        <div>
          <span className="font-bold text-indigo-900">StudentNest</span>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <p className="text-slate-500">© 2024 ستدي ستاي. مصمم لحياة طلابية أفضل.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 underline opacity-90 transition-colors hover:text-indigo-500 hover:opacity-100">
              سياسة الخصوصية
            </a>
            <a href="#" className="text-slate-500 underline opacity-90 transition-colors hover:text-indigo-500 hover:opacity-100">
              شروط الخدمة
            </a>
            <a href="#" className="text-slate-500 underline opacity-90 transition-colors hover:text-indigo-500 hover:opacity-100">
              تواصل مع الدعم
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;