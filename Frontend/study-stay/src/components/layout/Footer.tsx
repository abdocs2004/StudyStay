import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 lg:py-16 px-4 lg:px-8 mt-10 lg:mt-20 bg-slate-50 dark:bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="space-y-6 md:col-span-2 lg:col-span-1">
          <div className="font-headline text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-slate-50">
            حُجرة
          </div>
          <p className="font-body text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            سكن طلابي موثوق يعيد تعريف تجربة السكن عبر الثقة والتقنية والاهتمام.
          </p>
        </div>
        
        <div>
          <h5 className="font-bold mb-6">استكشف</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><Link to="/search" className="text-slate-500 hover:text-indigo-600 transition-all">ابحث عن سكن</Link></li>
            <li><Link to="/security" className="text-slate-500 hover:text-indigo-600 transition-all">معايير الأمان</Link></li>
            <li><Link to="/support" className="text-slate-500 hover:text-indigo-600 transition-all">مركز المساعدة</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold mb-6">الشركة</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><Link to="/about" className="text-slate-500 hover:text-indigo-600 transition-all">من نحن</Link></li>
            <li><Link to="/careers" className="text-slate-500 hover:text-indigo-600 transition-all">الوظائف</Link></li>
            <li><Link to="/support" className="text-slate-500 hover:text-indigo-600 transition-all">الدعم</Link></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-bold mb-6">القانونية</h5>
          <ul className="space-y-4 font-body text-sm">
            <li><Link to="/terms" className="text-slate-500 hover:text-indigo-600 transition-all">الشروط</Link></li>
            <li><Link to="/privacy" className="text-slate-500 hover:text-indigo-600 transition-all">الخصوصية</Link></li>
            <li><Link to="/security" className="text-slate-500 hover:text-indigo-600 transition-all">الأمان</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} حُجرة. سكنك الطلابي الموثوق.
      </div>
    </footer>
  );
};

export default Footer;
