import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
    return (
        <main className="grow min-h-screen bg-[#f9f9ff] font-body text-on-surface flex flex-col">
            {/* Organic Background Elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

            <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
                <div className="w-full max-w-110">
                    {/* Brand Anchor */}
                    <div className="text-center mb-10">
                        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary mb-2">StudyStay</h1>
                        <p className="text-on-surface-variant font-medium">رحلتك للسكن المناسب تبدأ من هنا.</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-[0_24px_60px_rgba(20,27,43,0.08)] p-8 md:p-10 border-0">
                        <header className="mb-8">
                            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">أهلا بعودتك</h2>
                            <p className="text-on-surface-variant text-sm">من فضلك أدخل بياناتك للوصول إلى حسابك.</p>
                        </header>

                        {/* LoginForm contains inputs and CTA */}
                        <LoginForm />
                    </div>

                    {/* Trust Badge (Student Focus) */}
                    <div className="mt-8 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor" />
                                <path d="M9.5 11l1.8 1.8L15.7 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest">بوابة آمنة</span>
                        </div>
                        <div className="w-px h-4 bg-outline-variant" />
                        <div className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 2L12 22" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest">موثق جامعيًا</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer (inline to match template) */}
            <footer className="mt-auto border-t border-[#e8e9f7] py-5 relative z-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 md:px-8 w-full text-center md:text-left">
                    <div className="shrink-0">
                        <span className="font-semibold text-primary">StudyStay</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm text-on-surface-variant">
                        <p>© 2024 StudyStay. منصة سكن طلابي موثوقة.</p>
                        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                            <a className="hover:text-primary underline underline-offset-4 transition-colors" href="#">سياسة الخصوصية</a>
                            <a className="hover:text-primary underline underline-offset-4 transition-colors" href="#">شروط الخدمة</a>
                            <a className="hover:text-primary underline underline-offset-4 transition-colors" href="#">تواصل مع الدعم</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default LoginPage;
