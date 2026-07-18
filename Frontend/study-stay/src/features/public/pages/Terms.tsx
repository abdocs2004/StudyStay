import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed-dim antialiased scroll-smooth">
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            المستندات القانونية
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-on-surface mb-6 max-w-3xl">
            شروط استخدام حُجرة
          </h1>
          <div className="flex items-center gap-4 text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary">event_note</span>
            <p className="text-lg">آخر تحديث: 8 يوليو 2026</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-2">
              <h3 className="font-headline font-bold text-sm tracking-widest uppercase text-on-surface-variant mb-6 pr-4">المحتويات</h3>
              <nav className="flex flex-col border-r-2 border-surface-container pr-2">
                <a className="py-2 pr-4 border-r-2 -mr-[2px] border-transparent hover:text-primary transition-all text-on-surface-variant font-medium hover:border-primary-fixed" href="#user-agreement">اتفاق المستخدم</a>
                <a className="py-2 pr-4 border-r-2 -mr-[2px] border-transparent hover:text-primary transition-all text-on-surface-variant font-medium hover:border-primary-fixed" href="#privacy">الخصوصية والبيانات</a>
                <a className="py-2 pr-4 border-r-2 -mr-[2px] border-transparent hover:text-primary transition-all text-on-surface-variant font-medium hover:border-primary-fixed" href="#safety">سلامة المجتمع</a>
                <a className="py-2 pr-4 border-r-2 -mr-[2px] border-transparent hover:text-primary transition-all text-on-surface-variant font-medium hover:border-primary-fixed" href="#payments">المدفوعات والرسوم</a>
                <a className="py-2 pr-4 border-r-2 -mr-[2px] border-transparent hover:text-primary transition-all text-on-surface-variant font-medium hover:border-primary-fixed" href="#termination">إنهاء الاستخدام</a>
              </nav>
            </div>
          </aside>

          <article className="lg:col-span-9 space-y-16 lg:space-y-24">
            <section className="prose prose-slate max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-on-surface-variant mb-8">
                بالوصول إلى منصة حُجرة واستخدام خدماتها، فإنك توافق على الالتزام بهذه الشروط. تهدف هذه الشروط إلى تنظيم العلاقة بين المنصة والمستخدمين بما يضمن بيئة سكنية آمنة وشفافة للطلاب وملاك العقارات.
              </p>
              <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border-r-4 border-primary">
                <p className="font-medium text-on-surface">
                  نحن نعمل على تقديم تجربة سكن طلابي موثوقة، مع احترام الخصوصية، وتطبيق معايير الأمان، وضمان وضوح المعاملات.
                </p>
              </div>
            </section>

            <section className="scroll-mt-32" id="user-agreement">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">person_check</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">1. اتفاق المستخدم</h2>
              </div>
              <div className="space-y-6 text-on-surface-variant leading-relaxed text-sm md:text-base">
                <p>يلزم أن يكون المستخدم مؤهلًا قانونيًا لاستخدام المنصة، وأن يقدم بيانات صحيحة ومحدثة أثناء التسجيل.</p>
                <ul className="space-y-4 list-none pr-0">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">check_circle</span>
                    <span>أنت مسؤول عن حماية بيانات الدخول وكلمة المرور الخاصة بحسابك.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">check_circle</span>
                    <span>يجب الإبلاغ فورًا عن أي استخدام غير مصرح به للحساب.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary-fixed-dim shrink-0">check_circle</span>
                    <span>تحتفظ المنصة بحق تعليق أو إغلاق الحسابات المخالفة أو التي تحتوي بيانات مضللة.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="scroll-mt-32" id="privacy">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined">shield</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">2. الخصوصية والبيانات</h2>
              </div>
              <div className="space-y-6 text-on-surface-variant leading-relaxed text-sm md:text-base">
                <p>نتعامل مع بياناتك الشخصية وفق سياسة الخصوصية المعتمدة، ونستخدمها فقط في تحسين الخدمة وتسهيل مطابقة السكن المناسب.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                    <h4 className="font-headline font-bold mb-2">جمع البيانات</h4>
                    <p className="text-sm">نجمع بيانات الهوية والتواصل والاستخدام لتقديم تجربة بحث وحجز أكثر دقة.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                    <h4 className="font-headline font-bold mb-2">مشاركة البيانات</h4>
                    <p className="text-sm">لا نقوم ببيع بياناتك. تتم المشاركة فقط مع الأطراف الموثقة اللازمة لإتمام إجراءات الحجز أو العقد.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="scroll-mt-32" id="safety">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">3. سلامة المجتمع</h2>
              </div>
              <div className="space-y-6 text-on-surface-variant leading-relaxed text-sm md:text-base">
                <p>نتبع سياسة عدم التسامح مع أي إساءة أو سلوك غير آمن داخل المنصة أو في العقارات المدرجة.</p>
                <div className="bg-primary/5 p-6 md:p-8 rounded-xl border border-primary-fixed-dim/20">
                  <h4 className="font-headline font-bold text-primary mb-4">بروتوكولات التوثيق</h4>
                  <p className="mb-4">تمر العقارات بسلسلة فحوصات تشمل:</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold border border-outline-variant/15 text-on-surface">توثيق الهوية</span>
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold border border-outline-variant/15 text-on-surface">مراجعة ميدانية للعقار</span>
                    <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold border border-outline-variant/15 text-on-surface">مراجعة عقد الإيجار</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="scroll-mt-32" id="payments">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">4. المدفوعات والرسوم</h2>
              </div>
              <div className="space-y-6 text-on-surface-variant leading-relaxed text-sm md:text-base">
                <p>تتم المدفوعات عبر بوابات دفع آمنة تابعة لطرف ثالث، ولا نقوم بتخزين بيانات البطاقات البنكية الكاملة.</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[300px]">
                    <thead>
                      <tr className="text-right border-b border-surface-container-highest">
                        <th className="py-4 font-headline font-bold text-sm md:text-base">نوع الخدمة</th>
                        <th className="py-4 font-headline font-bold text-sm md:text-base">هيكل الرسوم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      <tr>
                        <td className="py-4">رسوم التقديم</td>
                        <td className="py-4">تختلف حسب العقار</td>
                      </tr>
                      <tr>
                        <td className="py-4">رسوم الخدمة</td>
                        <td className="py-4">2.5% لكل عملية</td>
                      </tr>
                      <tr>
                        <td className="py-4">مبلغ التأمين</td>
                        <td className="py-4 text-secondary font-bold">قابل للاسترداد وفق الشروط</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="scroll-mt-32" id="termination">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">gavel</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">5. إنهاء الاستخدام</h2>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                يجوز للمنصة تعليق أو إيقاف الحسابات المخالفة لهذه الشروط، مع الاحتفاظ بحقها في اتخاذ الإجراءات القانونية اللازمة عند الضرورة.
              </p>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Terms;
