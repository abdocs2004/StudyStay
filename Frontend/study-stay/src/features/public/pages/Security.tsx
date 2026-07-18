import React from 'react';

const SECTIONS = [
  {
    icon: 'lock',
    title: 'حماية البيانات',
    desc: 'تُحفظ كلمات المرور مشفرة بالكامل، ولا يمكن لأي طرف — بما في ذلك فريقنا — الاطلاع عليها كنص صريح.',
  },
  {
    icon: 'privacy_tip',
    title: 'الخصوصية',
    desc: 'بيانات التواصل الشخصية (الهاتف، البريد، العنوان) تبقى مخفية تماماً عن الطرف الآخر حتى تتم الموافقة على طلب الدفع من الإدارة.',
  },
  {
    icon: 'payments',
    title: 'مدفوعات آمنة',
    desc: 'كل طلب دفع يمر بمراجعة يدوية من الإدارة قبل فتح أي بيانات، مع الاحتفاظ بإيصال الدفع ورقم العملية كدليل موثق.',
  },
  {
    icon: 'verified_user',
    title: 'التحقق من الهوية',
    desc: 'يتم التحقق من العقارات وطلبات السكن من قبل الإدارة قبل ظهورها للعامة، لتقليل فرص الإعلانات الوهمية.',
  },
  {
    icon: 'forum',
    title: 'أمان المحادثات',
    desc: 'نظام تلقائي يمنع مشاركة أرقام الهواتف أو روابط التواصل الاجتماعي داخل المحادثات قبل إتمام عملية الدفع، لحمايتك من محاولات الاحتيال خارج المنصة.',
  },
];

const Security: React.FC = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-16">
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            الأمان والثقة
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4">أمانك أولويتنا</h1>
          <p className="text-lg text-on-surface-variant">
            بنينا حُجرة مع الأمان في صميم كل ميزة — من التحقق من العقارات إلى حماية بيانات التواصل والمدفوعات.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-xl">{section.icon}</span>
              </div>
              <div>
                <h3 className="font-headline font-bold mb-1.5">{section.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{section.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-primary/5 border border-primary/10 p-8 text-center">
          <p className="text-sm text-on-surface-variant">
            هل لاحظت نشاطاً مريباً أو تواصلاً مشبوهاً؟{' '}
            <a href="mailto:support@hojra.com" className="font-bold text-primary hover:underline">
              أبلغنا فوراً على support@hojra.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Security;
