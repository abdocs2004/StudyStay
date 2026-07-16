import React from 'react';

const AuthFooter: React.FC = () => {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>تحتاج مساعدة؟ سنضيف روابط الدعم قريبًا.</p>
        <div className="flex items-center gap-4 font-medium text-slate-600">
          <a href="#" className="transition hover:text-indigo-600">
            الشروط
          </a>
          <a href="#" className="transition hover:text-indigo-600">
            الخصوصية
          </a>
          <a href="#" className="transition hover:text-indigo-600">
            تواصل معنا
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;