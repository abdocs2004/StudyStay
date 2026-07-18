import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto space-y-20">
        <header className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            من نحن
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-6">
            نجعل السكن الطلابي أسهل وأكثر أماناً
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            حُجرة هي منصة رقمية تربط بين الطلاب الباحثين عن سكن مناسب وملاك العقارات القريبة من الجامعات، بشكل موثوق وشفاف من البداية للنهاية.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <span className="material-symbols-outlined text-3xl text-primary mb-4 block">flag</span>
            <h2 className="font-headline text-2xl font-bold mb-3">مهمتنا</h2>
            <p className="text-on-surface-variant leading-relaxed">
              تسهيل رحلة البحث عن سكن طلابي آمن وميسور، من خلال منصة تجمع كل الخيارات في مكان واحد وتحمي حقوق الطرفين — الطالب والمالك.
            </p>
          </div>
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <span className="material-symbols-outlined text-3xl text-secondary mb-4 block">visibility</span>
            <h2 className="font-headline text-2xl font-bold mb-3">رؤيتنا</h2>
            <p className="text-on-surface-variant leading-relaxed">
              أن نصبح الوجهة الأولى لكل طالب جامعي في مصر عند البحث عن سكن، ولكل مالك عقار يبحث عن مستأجرين موثوقين وجادين.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-headline text-3xl font-bold text-center mb-10">كيف تعمل المنصة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: 'search', title: 'ابحث', desc: 'استخدم الفلاتر للبحث حسب الجامعة والمدينة والميزانية' },
              { icon: 'chat', title: 'تواصل', desc: 'راسل المالك أو الطالب مباشرة داخل المنصة' },
              { icon: 'lock_open', title: 'افتح البيانات', desc: 'ادفع رسوم بسيطة لفتح بيانات التواصل الكاملة بأمان' },
              { icon: 'home', title: 'استقر', desc: 'أتمم الاتفاق وانتقل لسكنك الجديد بثقة' },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                </div>
                <p className="text-xs font-bold text-primary mb-1">الخطوة {index + 1}</p>
                <h3 className="font-headline font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-linear-to-br from-primary to-primary-container text-white p-10 md:p-14">
          <h2 className="font-headline text-3xl font-bold mb-8">لماذا تختار حُجرة؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'verified', title: 'عقارات موثقة', desc: 'كل عقار يمر بمراجعة الإدارة قبل النشر' },
              { icon: 'shield', title: 'تواصل آمن', desc: 'بياناتك محمية حتى تختار فتحها بنفسك' },
              { icon: 'support_agent', title: 'دعم مستمر', desc: 'فريقنا متاح لمساعدتك في كل خطوة' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 p-6">
                <span className="material-symbols-outlined text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-headline font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/85">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
