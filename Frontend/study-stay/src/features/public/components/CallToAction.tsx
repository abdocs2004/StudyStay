
import { Link } from 'react-router-dom';

export default function CallToAction() {
    return (
        <section className="py-16 lg:py-24 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto bg-primary rounded-4xl p-8 lg:p-24 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10">
                    <h2 className="font-headline text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 lg:mb-8 max-w-3xl mx-auto">
                        انضم لآلاف الطلاب الذين وجدوا سكنهم القادم معنا.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-primary rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
                            أنشئ حسابك الآن
                        </Link>
                        <Link to="/search" className="w-full sm:w-auto flex justify-center items-center px-10 py-5 bg-primary-container border border-primary-fixed-dim/30 text-white rounded-xl font-bold text-lg hover:bg-primary-container/80 transition-all">
                            استكشف العقارات
                        </Link>
                    </div>
                    <p className="mt-8 text-indigo-200 text-sm">
                        أكثر من 20,000 طالب يستخدمون حُجرة في 15 دولة.
                    </p>
                </div>
            </div>
        </section>
    );
}
