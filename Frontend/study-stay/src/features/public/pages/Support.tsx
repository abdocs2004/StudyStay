import React, { useState } from 'react';

const FAQS = [
  { q: 'كيف أبحث عن سكن مناسب؟', a: 'استخدم صفحة العقارات وفعّل الفلاتر حسب الجامعة والمدينة والميزانية وعدد الغرف للوصول لأفضل النتائج.' },
  { q: 'متى تظهر بيانات تواصل المالك؟', a: 'بعد إرسال طلب دفع بسيط ومراجعته من فريق الإدارة، يتم فتح بيانات التواصل الكاملة تلقائياً.' },
  { q: 'كيف أنشر عقاري كمالك؟', a: 'من صفحة "عقاراتي"، أضف تفاصيل العقار وارفع من 3 إلى 7 صور. سيتم مراجعة الإعلان من الإدارة قبل ظهوره للطلاب.' },
  { q: 'ماذا لو تم رفض عقاري؟', a: 'ستظهر لك رسالة توضح سبب الرفض، ويمكنك تعديل البيانات وإعادة الإرسال للمراجعة مباشرة.' },
  { q: 'هل أموالي وبياناتي آمنة؟', a: 'نعم، جميع المدفوعات تتم مراجعتها يدوياً من الإدارة قبل فتح أي بيانات، ولا نشارك بياناتك مع أي طرف خارجي.' },
];

const Support: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-16">
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            مركز المساعدة
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4">كيف يمكننا مساعدتك؟</h1>
          <p className="text-lg text-on-surface-variant">إجابات على أكثر الأسئلة شيوعاً، وطرق للتواصل مع فريق الدعم مباشرة.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-2xl text-primary mb-3 block">mail</span>
            <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
            <p className="text-sm text-on-surface-variant">support@hojra.com</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-2xl text-primary mb-3 block">schedule</span>
            <h3 className="font-bold mb-1">ساعات الدعم</h3>
            <p className="text-sm text-on-surface-variant">يومياً من 10 صباحاً حتى 10 مساءً</p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-2xl text-primary mb-3 block">chat</span>
            <h3 className="font-bold mb-1">الدردشة المباشرة</h3>
            <p className="text-sm text-on-surface-variant">راسلنا عبر صفحة "الرسائل" داخل حسابك</p>
          </div>
        </section>

        <section>
          <h2 className="font-headline text-2xl font-bold mb-6">الأسئلة الشائعة</h2>
          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="rounded-2xl bg-surface-container-lowest overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-right font-bold"
                >
                  {faq.q}
                  <span className="material-symbols-outlined transition-transform" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </button>
                {openIndex === index && (
                  <p className="px-6 pb-4 text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;
