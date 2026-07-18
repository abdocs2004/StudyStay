import React from 'react';

const AuthHeader: React.FC = () => {
  return (
    <header className="mb-10 text-center lg:text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-indigo-600" />
        حُجرة
      </div>
      <h1 className="mt-5 font-headline text-3xl font-extrabold tracking-tight text-slate-900">انضم إلى المجتمع</h1>
      <p className="mt-2 text-sm font-medium text-slate-500">اعثر على سكنك الطلابي المثالي.</p>
    </header>
  );
};

export default AuthHeader;