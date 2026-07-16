import React from 'react';

const Testimonials: React.FC = () => {
    return (
        <section id="reviews" className="py-16 lg:py-24 px-4 lg:px-8 bg-surface-container-low">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 lg:mb-16">
                    <p className="text-sm font-bold text-outline uppercase tracking-widest mb-4">موثوق من مؤسسات حول العالم</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
                        <span className="font-headline text-2xl font-black">OXFORD</span>
                        <span className="font-headline text-2xl font-black">STANFORD</span>
                        <span className="font-headline text-2xl font-black">MIT</span>
                        <span className="font-headline text-2xl font-black">UCB</span>
                        <span className="font-headline text-2xl font-black">SORBONNE</span>
                    </div>
                </div>
                
                {/* TODO: Testimonials data might come from the backend. Currently using dummy data. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm italic text-on-surface-variant leading-relaxed relative">
                        <span className="material-symbols-outlined absolute top-4 right-8 text-6xl text-primary/5 opacity-20">format_quote</span>
                        "StudyStay سهّل انتقالي من الهند إلى لندن بشكل كبير. علامة التوثيق أعطتني ثقة كاملة وأنا أحجز من مسافة بعيدة."
                        <div className="mt-6 flex items-center gap-4 not-italic">
                            <div className="w-12 h-12 rounded-full bg-primary-fixed"></div>
                            <div>
                                <p className="font-bold text-on-surface">Priya Sharma</p>
                                <p className="text-xs text-outline">طالبة دراسات عليا - UCL</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm italic text-on-surface-variant leading-relaxed relative">
                        <span className="material-symbols-outlined absolute top-4 right-8 text-6xl text-primary/5 opacity-20">format_quote</span>
                        "كمالك عقار، أنا مقدر جودة المستأجرين عبر StudyStay. ونظام الدفع الآمن أفضل بكثير من أي منصة استخدمتها قبل كده."
                        <div className="mt-6 flex items-center gap-4 not-italic">
                            <div className="w-12 h-12 rounded-full bg-secondary-fixed"></div>
                            <div>
                                <p className="font-bold text-on-surface">Mark van der Berg</p>
                                <p className="text-xs text-outline">مالك موثق - أمستردام</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
