import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/'); // Or wherever it should go after onboarding completes
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-white h-[100dvh] w-full flex flex-col overflow-hidden">
      {/* TopNavBar */}
      <header className="shrink-0 w-full flex justify-between items-center px-6 py-4 bg-transparent z-50">
        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-headline">حُجرة</div>
        <button 
          onClick={() => navigate('/')} 
          className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium bg-surface-container-high/50 md:bg-white/50 px-4 py-1.5 rounded-full"
        >
          تخطي
        </button>
      </header>

      {/* Main Content Area - Scrollable for taller steps */}
      <main className="flex-1 min-h-0 w-full relative z-10 overflow-y-auto overflow-x-hidden">
        {step === 1 && (
          <div className="flex flex-col md:flex-row items-stretch w-full min-h-full">
            {/* Left Side: Visual Content */}
            <div className="relative w-full h-[45vh] md:h-full md:w-3/5 shrink-0 px-4 pb-4 md:px-12 md:pb-12 md:pt-4 flex flex-col">
              <div className="absolute inset-0 bg-surface-container-low hidden md:block z-0 pointer-events-none"></div>
              {/* Hero Image */}
              <div className="relative z-10 w-full flex-1 bg-surface-container-highest rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(20,27,43,0.08)]">
                <img 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                  data-alt="Modern high-end student apartment interior with minimalist wood desk, large window with soft sunlight, and a cozy aesthetic atmosphere." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFWYjoRd_Fsulwn91zTabpN8bM5YxReiJs4kU670sc1MVDgcsdaxUQbyRoW5SDiI7uGdfrU13y1Pwzz4pBSU198in2PUdayB1ghHtpz6_cQSa3zbKpGmAhxQ3_B-DclOVKuULQT_vOO1Calf-bOsln6OTlTxXN6-BJlsS7RphnQDmhKsff0lESC74cMQk5Lg7rqKlNWatjUdUNZmfkttWkQ1vd09MtKJMlHi269IFLcfM5dLRS5PSDJXEGEhv4lq6gU6Elr5n5ubM" 
                  alt="Student apartment interior"
                />
                {/* Floating Decorative Element */}
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-xl p-2 md:p-4 rounded-xl flex items-center gap-2 md:gap-3 shadow-lg">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-fixed-variant text-sm md:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-semibold text-on-surface-variant leading-none">موثق أمنيًا</p>
                    <p className="text-[8px] md:text-[10px] text-slate-500 mt-1">سكن شريك رسمي</p>
                  </div>
                </div>
              </div>
              {/* Accent Organic Shape */}
              <div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none z-0"></div>
            </div>

            {/* Right Side: Content Canvas */}
            <div className="relative w-full flex-1 md:w-2/5 flex flex-col justify-center px-6 py-6 md:px-12 bg-surface z-10">
              <div className="max-w-md w-full mx-auto md:mx-0">
                <span className="inline-block px-3 py-1.5 mb-4 md:mb-6 rounded-full bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
                  مرحبا بك في حُجرة
                </span>
                <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-on-surface leading-tight mb-4 md:mb-6">
                  سكنك <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">المثالي</span> ينتظرك
                </h1>
                <p className="text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed mb-8 md:mb-10 font-body">
                  اكتشف سكنًا طلابيًا آمنًا وموثقًا ومناسبًا لطبيعة حياتك الجامعية.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pt-6 md:pt-12 pb-12 px-4 md:px-6 max-w-5xl mx-auto w-full flex flex-col justify-center min-h-full">
            {/* Header Section */}
            <div className="mb-8 md:mb-12 text-center md:text-left mt-8 md:mt-0">
              <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
                خطوات بسيطة لسكنك الجديد
              </h1>
              <p className="text-on-surface-variant text-base md:text-xl max-w-2xl leading-relaxed mx-auto md:mx-0">
                إيجاد السكن الطلابي المناسب لا يجب أن يكون صعبًا. اختصرنا الرحلة في ثلاث خطوات سهلة.
              </p>
            </div>

            {/* Asymmetric Bento-style Grid for Steps */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Step 1: Search */}
              <div className="md:col-span-7 bg-surface-container-low rounded-xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary-container text-white rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold mb-2">1. ابحث</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-6 md:max-w-sm text-sm md:text-base">
                    تصفح إعلانات مختارة بالقرب من جامعتك ومفلترة حسب احتياجاتك اليومية.
                  </p>
                </div>
                <div className="mt-4 md:absolute md:bottom-[-20px] md:right-[-20px] md:w-64 md:h-64 transition-transform duration-500 group-hover:scale-105">
                  <img 
                    alt="students searching" 
                    className="rounded-xl shadow-2xl object-cover w-full h-48 md:h-full border-4 border-surface-container-lowest" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdLAbiVINFAR3pjiF-pIMKajNyCbz06TqlyBeoUqdk7HMjQKyx8MDDZZJsKoEN1kSBcPmV6x2r2pdUtCvMFqYFubiYcZssOCaGWBlHssNccXMaa-wMFefQWXzYmMI9GuKTd9ffiHBWRCGJohstTdXCBPHANBNz623g4FUsNxiRP0WcBnCppSBsaBMeWD-4rMuZkdt3vpR9bJlkBYUbK2VbSGyz_OAmV6T-04dP-XPHXp3JSwRcIK0vyQOh8Ejo42r0uxQE5g9Yg64"
                  />
                </div>
              </div>

              {/* Step 2: Book */}
              <div className="md:col-span-5 bg-surface-container-highest rounded-xl p-6 md:p-8 flex flex-col justify-center text-center">
                <div className="mx-auto w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>touch_app</span>
                </div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold mb-2">2. احجز</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                  احجز غرفتك المفضلة بضغطة واحدة بعقود واضحة وموثقة قانونيًا.
                </p>
                <div className="mt-8 bg-surface-container-lowest rounded-lg p-3 md:p-4 shadow-sm inline-flex items-center gap-3 self-center border border-outline-variant/15">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container text-sm md:text-base">check_circle</span>
                  </div>
                  <span className="font-semibold text-xs md:text-sm whitespace-nowrap">تم تأكيد الحجز</span>
                </div>
              </div>

              {/* Step 3: Move */}
              <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1 order-2 md:order-1">
                  <div className="w-12 h-12 bg-tertiary-container text-white rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined">home</span>
                  </div>
                  <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">3. انتقل</h3>
                  <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-6">
                    جهز أغراضك وابدأ فصلًا جديدًا. سكنك جاهز ومفحوص بالكامل لاستلامك.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <img alt="User profile" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSHVrgveHsh01cTRcR709etZqg1SaNHo39dwDMSYUAcS7GuGIgZw972H3MvakkHP1zQL2cD8xay4vB7gV3DKqOfl7BKHB46L76TH1DV2wVwnTwREpaLKEWC7MudYnPKMS0Geut4KQoa0qVyjlqcumoa-hNxASQaJk4CMwrcL0I1-W8mvCG15qIVo8_cqnwoc2jLqpFb4aLQQQy4loXpFj0g88jpHY3AKQ9ZfGIDBaewEJb0Wexe-_9nf4QmHM8JlpzI-8Gt3HEL90" />
                      <img alt="User profile" className="w-10 h-10 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSfHNqNZ9M-r8g7JIotqsjl0j4uvnMZAeL9lgRii8jm8V6H586QM2gWQ7SVzrAiy2fc8jncqkKDsn3grrMspUzetBuoVw5wdElNhpo442d9sI4rC48zumqWX3P3SjOORX_QQj_w3IaNKhdr7b4NFAmVCiAW-9Lnh2i5mgKlFBNFaWLYcAbAx7LlC85l9Q95rUgehv3IVdFCQ7ixfzOSK3d9sNBIPMmePGXCKTFt8z5Hrkn5tHib9kWhHQY_Q_xHLxa-pec4kUGz6M" />
                      <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-xs font-bold">+12</div>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant">انضموا إلى سكنك</span>
                  </div>
                </div>
                <div className="flex-1 order-1 md:order-2 w-full">
                  <img alt="modern apartment" className="rounded-xl shadow-xl object-cover w-full aspect-video md:aspect-square" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2EeXIegR9MrylN2qyArJtShrpNDFT2PGTV4IwkI15JcGRjg1S4cmYKTMiH5avLUflOAl8u6ftETHxQwxErGcpFfKTcUwMkPn432t7mL-epNRvewUb8L9ZgZ3s8_VOtVZN8PI5N-eQJHruG8_3UjAcpDiIvSyqc-HYqRL01krRH3yeZv48TK4DHOIb8ZvoJ2jyyjwc-hZKwEuwEIFx9eXsG-iSZ9VnLw55BQoPxqK4YztDAWvmc9sRpUXzNWlU8G3od76Z9mauHX0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="pt-6 md:pt-12 pb-12 flex flex-col justify-center min-h-full">
            <section className="flex-1 flex flex-col md:flex-row items-center px-6 md:px-16 gap-12 max-w-7xl mx-auto w-full">
              {/* Illustration: Organic Softness */}
              <div className="relative w-full md:w-1/2 aspect-square flex items-center justify-center max-h-[500px]">
                <div className="absolute inset-0 bg-surface-container rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
                <div className="absolute inset-0 bg-surface-container-low rounded-[3rem] -rotate-2"></div>
                <div className="relative z-10 w-full h-full p-4 sm:p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-surface-container-lowest p-8 rounded-full shadow-[0_12px_32px_rgba(20,27,43,0.06)] mb-8">
                    <span className="material-symbols-outlined text-primary !text-[60px] sm:!text-[75px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  </div>
                  {/* Floating Verification Badge Concept */}
                  <div className="absolute top-1/4 -right-4 sm:right-0 bg-white/70 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-lg flex items-center gap-2 sm:gap-3 animate-bounce">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs sm:text-sm font-semibold font-label">مالك موثق</span>
                  </div>
                  <div className="absolute bottom-1/4 -left-4 sm:left-0 bg-white/70 backdrop-blur-xl p-3 sm:p-4 rounded-xl shadow-lg flex items-center gap-2 sm:gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    <span className="text-xs sm:text-sm font-semibold font-label">تم فحص الخلفية</span>
                  </div>
                  <img alt="Safety and trust" className="absolute inset-0 w-full h-full object-cover rounded-[3rem] opacity-20 mix-blend-multiply pointer-events-none" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHaSQg9Ame3oeB6Q48Ri89JBNLxNYQOeFD6OSGoglK6j_MDhIPEgmjtLzPkFA1FyF5wESlxPn_67ifncF4GGhqK5ONCHKosVpi2kPxe2ZtgmxgS-k6_E7CCzuSh30koOj9F9xbuKMsrP1Lyezz2Dqu_J0cDbWX-POajMTDMoK2ZU95J_ulQltSb3mP9VFYijva8-XQvwZbuLg46v1K5HxD_0DWFpPSqfJvXC8QRQxkp8Is8r0-5Zd9kr177uXvuCBFqX09QTMdDzM"/>
                </div>
              </div>
              {/* Content: Editorial Authority */}
              <div className="w-full md:w-1/2 space-y-8">
                <div className="space-y-4 text-center md:text-left">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold font-label uppercase tracking-wider">
                    الخطوة 3 من 3: التحقق
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface font-headline leading-[1.1] tracking-tight">
                    الثقة هي <span className="text-primary italic">أساسنا</span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl text-on-surface-variant leading-relaxed max-w-lg mx-auto md:mx-0">
                    كل إعلان يتم مراجعته يدويًا وكل مالك يخضع لفحص الخلفية. أمانك وراحتك أولويتنا.
                  </p>
                </div>
                {/* Trust Points: Bento-Lite Pattern */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-surface-container-low rounded-xl flex flex-col gap-3 items-center md:items-start text-center md:text-left">
                    <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                    <h3 className="font-bold font-headline">مراجعة يدوية</h3>
                    <p className="text-sm text-on-surface-variant">نفحص كل عقار يدويًا قبل نشره على المنصة.</p>
                  </div>
                  <div className="p-6 bg-surface-container-low rounded-xl flex flex-col gap-3 items-center md:items-start text-center md:text-left">
                    <span className="material-symbols-outlined text-secondary text-3xl">gavel</span>
                    <h3 className="font-bold font-headline">التزام صارم</h3>
                    <p className="text-sm text-on-surface-variant">التزام كامل بلوائح الأمان والسكن الطلابي.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* BottomNavBar as Onboarding Controls */}
      <nav className="shrink-0 w-full z-50 flex justify-between items-center px-6 md:px-12 pb-6 md:pb-8 pt-4 bg-surface md:bg-transparent border-t border-slate-200/20 relative">
        <div className="absolute inset-0 bg-surface-container-low hidden md:block z-[-1] right-[40%] transition-opacity duration-300" style={{ opacity: step === 1 ? 1 : 0 }}></div>
        <button 
          onClick={handleBack} 
          className={`flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 px-4 md:px-6 py-2 md:py-3 hover:bg-indigo-50 transition-all rounded-full group active:scale-95 ${step === 1 ? 'invisible' : ''}`}
        >
          <span className="material-symbols-outlined mb-0.5 group-hover:text-indigo-600 transition-colors">arrow_back</span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold group-hover:text-indigo-600 transition-colors hidden sm:inline-block">رجوع</span>
        </button>

        {/* Dynamic Progress Dots */}
        <div className="flex items-center gap-2 transition-all">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-300'}`}></div>
        </div>

        {step < 3 ? (
          <button 
            onClick={handleNext}
            className="flex flex-col items-center justify-center bg-indigo-600 text-white rounded-full px-8 md:px-12 py-2 md:py-3 hover:bg-indigo-700 hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all shadow-md group"
          >
            <span className="material-symbols-outlined mb-0.5">arrow_forward</span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold">التالي</span>
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full px-6 md:px-10 py-3 md:py-4 shadow-[0_12px_32px_rgba(79,70,229,0.25)] hover:shadow-[0_16px_40px_rgba(79,70,229,0.35)] transition-all transform active:scale-95 group"
          >
            <span className="font-headline font-bold text-sm md:text-lg mr-2">ابدأ الآن</span>
            <span className="material-symbols-outlined text-xl md:text-2xl transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default Onboarding;
