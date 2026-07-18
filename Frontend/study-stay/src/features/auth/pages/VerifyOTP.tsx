    import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
    const VerifyOTP: React.FC = () => {
    const [resendTimer, setResendTimer] = useState(59);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const canResend = resendTimer === 0;
    const navigate = useNavigate();

    useEffect(() => {
        if (resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleResend = () => {
        setResendTimer(59);
    };

    const handleVerifySubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (otp.some((digit) => digit.trim() === '')) {
            setErrorMessage('من فضلك أدخل الأرقام الستة كاملة قبل المتابعة.');
            return;
        }

        setErrorMessage('');
        navigate('/create-new-password');
    };

    return (
        <div className="min-h-screen bg-[#f7f7ff] text-on-surface flex flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl shadow-sm h-16 flex justify-between items-center px-6 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-on-surface font-headline">
                The Sanctuary
            </span>
            </div>
            <button className="p-2 rounded-full hover:bg-indigo-50/50 transition-colors text-on-surface-variant">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m.5-13h-1v6l5.2 3.1.7-1.2-5-3v-4.9z"
                stroke="currentColor"
                strokeWidth="1.5"
                />
            </svg>
            </button>
        </header>

        {/* Main Content */}
        <main className="grow flex items-center justify-center pt-16 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl" />

            <div className="w-full max-w-md z-10">
            {/* Progress Indicator */}
            <div className="mb-8 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                <div className="h-1.5 w-12 rounded-full bg-primary" />
                <div className="h-1.5 w-12 rounded-full bg-primary" />
                <div className="h-1.5 w-12 rounded-full bg-surface-container-high" />
                </div>
                <span className="text-label text-xs font-semibold tracking-wider text-primary uppercase">
                الخطوة 2 من 3
                </span>
            </div>

            {/* OTP Card */}
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                <div className="text-center mb-8">
                <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-3">
                    تحقق من بريدك الإلكتروني
                </h1>
                <p className="text-on-surface-variant leading-relaxed">
                    أرسلنا رمزًا مكونًا من 6 أرقام إلى{' '}
                    <span className="font-semibold text-on-surface">alex@example.com</span>
                </p>
                </div>

                                {errorMessage ? (
                                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {errorMessage}
                                    </div>
                                ) : null}

                <form className="space-y-8 overflow-hidden" onSubmit={handleVerifySubmit}>
                {/* Digit Inputs */}
                <div className="mx-auto grid max-w-105 grid-cols-6 gap-2 sm:gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        autoFocus={index === 0}
                        className="h-16 w-full min-w-0 rounded-2xl border border-transparent bg-surface-container-low text-center text-2xl font-bold text-primary outline-none transition-all hover:border-[#c8d8ff] focus:border-[#c8d8ff] focus:ring-2 focus:ring-[#c8d8ff] sm:h-18"
                        maxLength={1}
                        type="text"
                                                inputMode="numeric"
                        value={otp[index]}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value)) {
                            const newOtp = [...otp];
                            newOtp[index] = value;
                            setOtp(newOtp);
                          }
                        }}
                    />
                    ))}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                    className="w-full bg-linear-to-r from-primary to-primary text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                    style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #3525cd 100%)',
                    }}
                    type="submit"
                    >
                    <span>تحقق واستمر</span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                    </button>

                    <div className="text-center">
                    <p className="text-on-surface-variant text-sm">
                        لم يصلك الرمز؟{' '}
                        <button
                        className={`font-semibold transition-colors ${
                            canResend
                            ? 'text-primary hover:underline decoration-2 underline-offset-4'
                            : 'text-outline no-underline'
                        }`}
                        disabled={!canResend}
                        onClick={handleResend}
                        type="button"
                        >
                        إعادة إرسال الرمز (00:{String(resendTimer).padStart(2, '0')})
                        </button>
                    </p>
                    </div>
                </div>
                </form>

                {/* Security Notice */}
                <div className="mt-8 pt-6 border-t border-outline-variant/15 flex items-center justify-center gap-2 text-on-surface-variant text-sm">
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m3.5-9L11 13.5 8.5 11 7 12.5 11 16.5 17 10.5z" />
                </svg>
                <span>تحقق آمن ومشفر</span>
                </div>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
                <Link
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
                to="/login"
                >
                <span className="text-lg">←</span>
                <span>العودة لتسجيل الدخول</span>
                </Link>
            </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 bg-surface border-t border-indigo-100/10">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-lg font-bold text-on-surface font-headline">The Sanctuary</span>
                <p className="text-slate-500 font-body text-sm">
                © 2024 حُجرة. جميع الحقوق محفوظة.
                </p>
            </div>
            <div className="flex gap-6">
                <a
                className="text-slate-500 font-body text-sm hover:text-indigo-500 transition-colors"
                href="#"
                >
                سياسة الخصوصية
                </a>
                <a
                className="text-slate-500 font-body text-sm hover:text-indigo-500 transition-colors"
                href="#"
                >
                شروط الخدمة
                </a>
                <a
                className="text-slate-500 font-body text-sm hover:text-indigo-500 transition-colors"
                href="#"
                >
                الدعم
                </a>
            </div>
            </div>
        </footer>
        </div>
    );
    };

    export default VerifyOTP;