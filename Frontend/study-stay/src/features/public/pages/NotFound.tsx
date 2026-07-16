import React from "react";
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary-container/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-secondary-container/10 blur-[100px]"></div>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-surface-container-lowest rounded-xl p-6 md:p-12 lg:p-16 shadow-[0_12px_32px_rgba(20,27,43,0.06)] relative z-10">
          
          {/* Illustration Column (Asymmetric Bleed) */}
          <div className="relative group order-2 md:order-1 mt-8 md:mt-0">
            <div className="absolute -inset-4 bg-surface-container-low rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
            <div className="relative overflow-hidden rounded-xl bg-surface-container-high aspect-square flex items-center justify-center">
              <img alt="Lost in thought student" className="object-cover w-full h-full mix-blend-multiply opacity-80" data-alt="Modern 3D digital illustration of a confused student holding a map and looking at a beautiful wooden door in an airy, minimalist hallway with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBrWcjO_igIIWrNz7ziMSJI1DwuuPBT4LYWW9N_xqqi-6nL6W73ZsH2x0Rl5YZsD65D-nU3vNWqdNlCVnxUU5cOFA9MO_ioQV4BLvGLBJZJe5TuabggNR8mdK3WRMHueJTK97veZjovawDAKQ12-fB9_ZKG2nphskTG7qmz9WLMrFUDbyv4ZnglFRPZzxwQ-SnVJuvEDULYkeYGdkAaDIc_wk1vtyhX7r70l39DcGpPJPxIPS8-dX7R88GuNsfoXBKbQ8ccehnXTE"/>
              
              {/* Text Overlay / UI Elements */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-3 md:p-4 bg-white/70 backdrop-blur-[24px] rounded-xl border border-white/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary-container p-2 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container text-lg">verified_user</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">بروتوكول الأمان</p>
                    <p className="text-on-surface font-semibold text-xs md:text-sm">المنطقة 404: صفحة غير موجودة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="space-y-6 md:space-y-8 order-1 md:order-2 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">error</span>
                <span className="text-xs font-bold text-primary tracking-wide uppercase">الصفحة غير موجودة</span>
              </div>
              <h1 className="font-headline font-extrabold text-4xl md:text-5xl leading-tight text-on-surface tracking-tight">
                عذرًا! الصفحة دي مش موجودة على خريطتنا.
              </h1>
              <p className="font-body text-base md:text-lg text-on-surface-variant leading-relaxed">
                الصفحة التي تبحث عنها ربما تم نقلها أو لم تعد موجودة. لا تقلق، هذا يحدث أحيانًا.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link className="bg-gradient-to-br from-primary-container to-primary text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl flex items-center justify-center gap-2 shadow-[0_12px_32px_rgba(79,70,229,0.2)] hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto" to="/">
                <span className="material-symbols-outlined">home</span>
                العودة للرئيسية
              </Link>
              <button className="bg-surface-container-high text-primary font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-colors w-full sm:w-auto">
                <span className="material-symbols-outlined">help_center</span>
                تواصل مع الدعم
              </button>
            </div>
            
            <div className="pt-6 md:pt-8 border-t border-outline-variant/15">
              <p className="text-sm font-medium text-slate-400 mb-4">وجهات مقترحة لك:</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Link className="px-4 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface-variant hover:text-primary transition-colors" to="/">استوديوهات مميزة</Link>
                <Link className="px-4 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface-variant hover:text-primary transition-colors" to="/">دليل السكن</Link>
                <Link className="px-4 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface-variant hover:text-primary transition-colors" to="/">خريطة البحث</Link>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default NotFound;
