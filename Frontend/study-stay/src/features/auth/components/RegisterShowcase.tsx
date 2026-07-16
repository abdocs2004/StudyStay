import React from 'react';

type FeatureItem = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-indigo-100 backdrop-blur-sm">
    {children}
  </span>
);

const RegisterShowcase: React.FC = () => {
  const features: FeatureItem[] = [
    {
      title: 'إعلانات موثقة',
      description: 'كل عقار يتم فحصه من فريقنا قبل النشر.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path d="M12 3L4 7V12C4 16.5 7.2 20.5 12 22C16.8 20.5 20 16.5 20 12V7L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 12.5L11.2 14.7L15.2 10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'حجز آمن',
      description: 'بياناتك ومدفوعاتك محمية بالكامل من البداية للنهاية.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path d="M8.5 11V8.5C8.5 6.3 10 4.5 12 4.5C14 4.5 15.5 6.3 15.5 8.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6.5 11H17.5V19H6.5V11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 14.1V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative hidden overflow-hidden bg-linear-to-br from-indigo-700 via-indigo-700 to-indigo-900 lg:flex lg:w-[55%]">
      <img
        src="/images/unnamed (4).png"
        alt="Students studying together"
        className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(107,114,255,0.26),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.18),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
      <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-sky-300/20 blur-[120px]" />

      <div className="relative z-10 flex h-full w-full flex-col justify-end p-14 xl:p-20">
        <div className="max-w-xl rounded-[2.5rem] border border-white/15 bg-white/10 p-10 text-white shadow-[0_32px_64px_rgba(15,23,42,0.18)] backdrop-blur-2xl xl:p-12">
          <div className="mb-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-3">
            <div className="flex -space-x-3">
              <img src="/images/unnamed (1).png" alt="Student avatar 1" className="h-10 w-10 rounded-full border-2 border-white/70 object-cover" />
              <img src="/images/unnamed (2).png" alt="Student avatar 2" className="h-10 w-10 rounded-full border-2 border-white/70 object-cover" />
              <img src="/images/unnamed (3).png" alt="Student avatar 3" className="h-10 w-10 rounded-full border-2 border-white/70 object-cover" />
            </div>
            <span className="text-sm font-semibold text-white/90">انضم إلى +12,000 طالب موثق</span>
          </div>

          <h2 className="font-headline text-4xl font-extrabold leading-tight text-white">
            رحلتك الجامعية <br />
            <span className="text-emerald-300">تبدأ بسكن مناسب.</span>
          </h2>

          <p className="mt-4 max-w-lg text-lg font-medium text-white/80">
            استمتع بسكن طلابي مصمم للتميز الأكاديمي وحياة مجتمعية نابضة.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <div>
                  <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterShowcase;