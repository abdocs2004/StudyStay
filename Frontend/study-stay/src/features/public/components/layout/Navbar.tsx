import { Link } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <nav className="flex items-center justify-between px-4 lg:px-8 py-4 max-w-7xl mx-auto font-body">
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 transition"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-[28px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                    {isAuthenticated && user?.role === 'owner' && (
                        <Link
                            to="/owner/profile"
                            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                        >
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            بروفايل المالك
                        </Link>
                    )}
                    {isAuthenticated && user?.role === 'student' && (
                        <Link
                            to="/student/profile"
                            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                        >
                            <span className="material-symbols-outlined text-[18px]">person</span>
                            بروفايل الطالب
                        </Link>
                    )}
                    <Link to="/" className="font-headline text-2xl font-extrabold tracking-tighter text-indigo-600">
                        حُجرة
                    </Link>
                </div>
                
                <div className="hidden lg:flex items-center gap-6">
                    <Link to="/search" className="text-sm font-semibold tracking-tight text-indigo-600 transition-colors duration-200">الشقق</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/favorites" className="text-sm font-medium tracking-tight text-slate-600 hover:text-indigo-500 transition-colors duration-200">المفضلة</Link>
                            <Link to="/bookings" className="text-sm font-medium tracking-tight text-slate-600 hover:text-indigo-500 transition-colors duration-200">حجوزاتي</Link>
                            <Link to="/messages" className="text-sm font-medium tracking-tight text-slate-600 hover:text-indigo-500 transition-colors duration-200">الرسائل</Link>
                            {user?.role === 'owner' ? (
                                <Link to="/owner/home" className="text-sm font-medium tracking-tight text-slate-600 hover:text-indigo-500 transition-colors duration-200">لوحة التحكم</Link>
                            ) : (
                                <Link to="/home" className="text-sm font-medium tracking-tight text-slate-600 hover:text-indigo-500 transition-colors duration-200">الرئيسية</Link>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:inline-block text-sm text-slate-600 font-medium">أهلاً، {user?.name}</span>
                            <button
                                onClick={logout}
                                className="hidden sm:block px-5 py-2 font-body text-sm font-medium text-rose-600 hover:text-rose-800 transition-transform active:scale-90 cursor-pointer"
                            >
                                تسجيل الخروج
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:block px-5 py-2 font-body text-sm font-medium text-slate-600 hover:text-indigo-600 transition-transform active:scale-90">تسجيل الدخول</Link>
                            <Link to="/register" className="px-5 md:px-6 py-2 md:py-2.5 bg-linear-to-br from-primary-container to-primary text-white rounded-xl font-body text-sm font-medium shadow-[0_12px_32px_rgba(20,27,43,0.06)] transition-transform scale-95 active:scale-90">إنشاء حساب</Link>
                        </>
                    )}
                </div>
            </nav>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 flex flex-col font-body">
                    <Link to="/search" className="px-6 py-4 border-b border-slate-50 text-indigo-600 font-bold" onClick={() => setIsMobileMenuOpen(false)}>الشقق</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/favorites" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>المفضلة</Link>
                            <Link to="/bookings" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>حجوزاتي</Link>
                            <Link to="/messages" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>الرسائل</Link>
                            {user?.role === 'owner' ? (
                                <Link to="/owner/home" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>لوحة التحكم</Link>
                            ) : (
                                <Link to="/home" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link>
                            )}
                            <button
                                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                className="px-6 py-4 text-right font-medium text-rose-600 hover:bg-rose-50 w-full"
                            >
                                تسجيل الخروج
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="px-6 py-4 border-b border-slate-50 text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>تسجيل الدخول</Link>
                    )}
                </div>
            )}
        </header>
    );
}