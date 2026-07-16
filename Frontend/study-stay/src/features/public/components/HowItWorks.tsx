

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-16 lg:py-24 px-4 lg:px-8 bg-surface">
            <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 lg:mb-6">رحلتك إلى السكن المناسب</h2>
                <p className="text-lg text-on-surface-variant">سواء تنتقل من مدينة لأخرى أو من دولة لدولة، نحن نبسط كل خطوة.</p>
            </div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                {/* Visual Connectors (Desktop) */}
                <div className="hidden md:block absolute top-1/4 left-1/3 w-1/4 h-px border-t-2 border-dashed border-outline-variant/30"></div>
                <div className="hidden md:block absolute top-1/4 left-2/3 w-1/4 h-px border-t-2 border-dashed border-outline-variant/30"></div>
                
                <div className="text-center">
                    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <span className="material-symbols-outlined text-3xl text-primary">search</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">ابحث</h3>
                    <p className="text-on-surface-variant px-6">تصفح إعلانات منتقاة بالقرب من جامعتك مع جولات تفصيلية ومعلومات واضحة.</p>
                </div>
                
                <div className="text-center">
                    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <span className="material-symbols-outlined text-3xl text-primary">event_available</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">احجز</h3>
                    <p className="text-on-surface-variant px-6">ثبت سكنك بعقد رقمي موثق ومنصة دفع مشفرة وآمنة.</p>
                </div>
                
                <div className="text-center">
                    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <span className="material-symbols-outlined text-3xl text-primary">local_shipping</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-3">انتقل</h3>
                    <p className="text-on-surface-variant px-6">استلم مفاتيحك وانتقل بسهولة إلى سكنك الجديد بدون توتر. نحن معك دائمًا.</p>
                </div>
            </div>
        </section>
    );
}
