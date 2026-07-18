    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';

    const ResetPassword: React.FC = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
        const navigate = useNavigate();

    const passwordStrength = (() => {
        let score = 0;

        if (newPassword.length >= 8) score += 1;
        if (/[A-Z]/.test(newPassword)) score += 1;
        if (/[0-9]/.test(newPassword)) score += 1;
        if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

        return score;
    })();

    const displayStrength = newPassword ? passwordStrength : 3;
    const strengthLabel = ['ضعيفة', 'مقبولة', 'جيدة', 'قوية', 'قوية'][displayStrength];

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newPassword.trim() || !confirmPassword.trim()) {
            setErrorMessage('من فضلك أدخل كلمة المرور الجديدة وتأكيدها.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('كلمتا المرور غير متطابقتين.');
            return;
        }

        setErrorMessage('');
        navigate('/reset-success');
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl shadow-sm h-16 flex justify-between items-center px-6">
            <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-indigo-600 font-headline">The Sanctuary</span>
            </div>
            <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-indigo-50/50 transition-colors text-on-surface-variant" type="button">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                    d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m.5-13h-1v6l5.2 3.1.7-1.2-5-3v-4.9z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                />
                </svg>
            </button>
            </div>
        </header>

        <main className="grow flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-130 z-10">
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex gap-2 items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary font-label">الخطوة 3 من 3</span>
                </div>
                <div className="flex gap-1.5">
                <div className="h-1.5 w-8 rounded-full bg-primary" />
                <div className="h-1.5 w-8 rounded-full bg-primary" />
                <div className="h-1.5 w-8 rounded-full bg-primary" />
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-4x1 p-8 md:p-10 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                <div className="mb-8">
                <h1 className="text-[32px] font-bold font-headline text-on-surface tracking-tight mb-4">إنشاء كلمة مرور جديدة</h1>
                <p className="text-[18px] leading-[1.45] text-on-surface-variant">يجب أن تكون كلمة المرور الجديدة مختلفة عن الكلمات السابقة.</p>
                </div>

                {errorMessage ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                ) : null}

                <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant font-label px-1" htmlFor="new_password">
                    كلمة المرور الجديدة
                    </label>
                    <div className="relative group">
                    <input
                        className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-fixed-dim rounded-[18px] py-4 pl-4 pr-12 transition-all placeholder:text-outline"
                        id="new_password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        type={showNewPassword ? 'text' : 'password'}
                    />
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                        onClick={() => setShowNewPassword((previous) => !previous)}
                        type="button"
                    >
                        {showNewPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M9.5 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.8-4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M10.8 5.4A10.9 10.9 0 0 1 12 5c5.2 0 9.4 3.2 11 7-1.2 2.8-3.2 5.1-6 6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2 1)" />
                        </svg>
                        ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M2.5 12C3.8 8.2 8 5 12 5s8.2 3.2 9.5 7c-1.3 3.8-5.5 7-9.5 7S3.8 15.8 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        )}
                    </button>
                    </div>

                    <div className="pt-2 px-1">
                    <div className="flex gap-1 mb-2">
                        {Array.from({ length: 4 }).map((_, index) => {
                        const isActive = index < displayStrength;

                        return (
                            <div key={index} className="h-1 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                            <div
                                className={`h-full rounded-full bg-secondary transition-all duration-300 ${
                                isActive ? 'w-full' : 'w-0'
                                }`}
                            />
                            </div>
                        );
                        })}
                    </div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">
                        مستوى القوة: {strengthLabel}
                    </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-on-surface-variant font-label px-1" htmlFor="confirm_password">
                    تأكيد كلمة المرور
                    </label>
                    <div className="relative group">
                    <input
                        className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary-fixed-dim rounded-[18px] py-4 pl-4 pr-12 transition-all placeholder:text-outline"
                        id="confirm_password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-primary transition-colors"
                        onClick={() => setShowConfirmPassword((previous) => !previous)}
                        type="button"
                    >
                        {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M2.5 12C3.8 8.2 8 5 12 5s8.2 3.2 9.5 7c-1.3 3.8-5.5 7-9.5 7S3.8 15.8 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                            <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M9.5 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.8-4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M10.8 5.4A10.9 10.9 0 0 1 12 5c5.2 0 9.4 3.2 11 7-1.2 2.8-3.2 5.1-6 6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2 1)" />
                        </svg>
                        )}
                    </button>
                    </div>
                </div>

                <div className="bg-[#f7f8ff] rounded-[18px] px-4 py-4 space-y-4">
                    <div className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 text-secondary shrink-0">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <path d="M9.4 12.2l1.8 1.8 3.6-4" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>على الأقل 8 أحرف</span>
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-on-surface-variant">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 text-secondary shrink-0">
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <path d="M9.4 12.2l1.8 1.8 3.6-4" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>حرف كبير واحد ورقم واحد</span>
                    </div>
                </div>

                <button
                    className="w-full text-white font-semibold py-4.5 rounded-[18px] shadow-[0_12px_24px_rgba(53,37,205,0.28)] hover:opacity-90 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 text-[17px]"
                    style={{ backgroundColor: '#4b41e2' }}
                    type="submit"
                >
                    إعادة تعيين كلمة المرور
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M13 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                </form>

                <div className="mt-10 text-center">
                <Link className="text-[15px] font-semibold hover:underline decoration-2 underline-offset-4" style={{ color: '#3525cd' }} to="/login">
                    العودة لتسجيل الدخول
                </Link>
                </div>
            </div>

            <div className="mt-12 text-center opacity-20 pointer-events-none select-none flex justify-center">
                <img
                    src="/icons/lock-shield.svg"
                    alt="Lock shield"
                    className="h-24 w-auto"
                />
            </div>
            </div>
        </main>

        <footer className="w-full py-8 bg-surface border-t border-indigo-100/10">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
            <div className="text-lg font-bold text-on-surface font-headline">The Sanctuary</div>
            <div className="text-slate-500 text-sm font-body">© 2024 حُجرة. جميع الحقوق محفوظة.</div>
            <div className="flex gap-6">
                <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
                سياسة الخصوصية
                </a>
                <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
                شروط الخدمة
                </a>
                <a className="text-slate-500 text-sm hover:text-indigo-500 transition-colors" href="#">
                الدعم
                </a>
            </div>
            </div>
        </footer>
        </div>
    );
    };

    export default ResetPassword;