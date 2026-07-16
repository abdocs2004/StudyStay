
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section className="relative min-h-[100svh] lg:min-h-[921px] flex items-center px-4 lg:px-8 overflow-hidden pt-20 lg:pt-0">
            <div className="absolute inset-0 z-0">
                <img 
                    className="w-full h-full object-cover brightness-[0.95]" 
                    alt="Modern spacious student dormitory with minimalist wooden furniture, large windows overlooking a city campus, and warm sunlight streaming through" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsSvl0nawDtV50KLtan-17bV322OYtdRo7oZ4S2Js3Lw3FX7pkinBP-Sqf3PpaUWLH9tz5bkcEd5sDoV5yxmfev9fUPPXYAYqlWyJ60tUSZNtCjrrbFe_Wqy25-OuEAdm2bnJpMQIfaPnthHopM_gNc6zEcy-EYvkz-4Q_rlzFhBt3MD6-L7A5FHWkXrf4Hptg_Ecqekck_Q7cNw-aTeYHaTpwhmK7A3nnZ34CA1vUHdegrF47SA6qicdrvzw-8Q4uhccvcv0Dn5Q"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-bright via-surface-bright/80 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 lg:space-y-8">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-on-surface">
                        اعثر على <span className="text-primary">سكن طلابي آمن</span> بالقرب من جامعتك
                    </h1>
                    <p className="text-lg lg:text-xl text-on-surface-variant max-w-lg leading-relaxed">
                        اكتشف مساكن مختارة بعناية للتركيز الأكاديمي والحياة المجتمعية. إعلانات موثقة وحجوزات آمنة ودعم على مدار الساعة.
                    </p>
                    
                    {/* Search Bar Bento-Style */}
                    <div className="p-2 bg-surface-container-lowest rounded-xl shadow-[0_12px_48px_rgba(20,27,43,0.1)] max-w-2xl flex flex-col md:flex-row items-center gap-2">
                        <div className="w-full flex-1 flex items-center px-4 py-3 gap-3">
                            <span className="material-symbols-outlined text-outline">location_on</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">الموقع</span>
                                <input className="border-none p-0 focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant bg-transparent" placeholder="المدينة أو الجامعة" type="text" />
                            </div>
                        </div>
                        
                        <div className="hidden md:block w-px h-10 bg-outline-variant/30"></div>
                        
                        <div className="w-full flex-1 flex items-center px-4 py-3 gap-3">
                            <span className="material-symbols-outlined text-outline">payments</span>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">نطاق السعر</span>
                                <input className="border-none p-0 focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant bg-transparent" placeholder="الميزانية الشهرية" type="text" />
                            </div>
                        </div>
                        
                        <Link to="/search" className="w-full md:w-auto px-8 py-4 bg-gradient-to-br from-primary-container to-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95">
                            <span className="material-symbols-outlined">search</span>
                            استكشف
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}