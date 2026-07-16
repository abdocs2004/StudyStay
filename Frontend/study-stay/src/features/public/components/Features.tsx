

export default function Features() {
    return (
        <section className="py-16 lg:py-24 px-4 lg:px-8 bg-surface">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    <div className="group">
                        <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-3">عقارات موثقة</h3>
                        <p className="text-on-surface-variant leading-relaxed">كل إعلان يتم فحصه ميدانيا بواسطة فريقنا لضمان أعلى معايير الأمان والجودة.</p>
                    </div>
                    
                    <div className="group">
                        <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-3">مدفوعات آمنة</h3>
                        <p className="text-on-surface-variant leading-relaxed">يتم حفظ التأمين في حساب ضمان حتى الاستلام. آمن وشفاف وبدون تعقيدات.</p>
                    </div>
                    
                    <div className="group">
                        <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
                        </div>
                        <h3 className="font-headline text-xl font-bold mb-3">دعم مخصص للطلاب</h3>
                        <p className="text-on-surface-variant leading-relaxed">خبراء انتقال وسكن يساعدونك في العقود وإجراءات الجامعة خطوة بخطوة.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
