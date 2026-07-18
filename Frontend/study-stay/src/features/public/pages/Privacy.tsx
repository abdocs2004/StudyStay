export default function Privacy() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-on-surface-variant font-bold text-xs uppercase tracking-widest mb-6 px-4 font-headline">التنقل</h3>
              <nav className="flex flex-col">
                <a className="px-4 py-3 rounded-xl bg-primary-container/10 text-primary font-bold border-r-4 border-primary transition-all" href="#data-collection">جمع البيانات</a>
                <a className="px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all" href="#use-of-info">استخدام المعلومات</a>
                <a className="px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all" href="#cookies">سياسة ملفات الارتباط</a>
                <a className="px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all" href="#third-party">المشاركة مع أطراف خارجية</a>
                <a className="px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all" href="#security">تدابير الأمان</a>
                <a className="px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all" href="#contact">تواصل معنا</a>
              </nav>
              <div className="mt-12 p-6 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p className="text-sm font-semibold text-on-surface mb-2">ضمان ثقة الطلاب</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">بياناتك مشفرة ومحمية وفق أعلى معايير الخصوصية.</p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <header className="mb-16">
              <div className="inline-block px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold mb-6">
                آخر تحديث: 8 يوليو 2026
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-tight mb-6 font-headline">سياسة الخصوصية</h1>
              <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
                في حُجرة، خصوصيتك أولوية أساسية. توضح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها أثناء استخدامك للمنصة.
              </p>
            </header>

            <div className="space-y-16">
              <section className="scroll-mt-32" id="data-collection">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">database</span>
                  </div>
                  <h2 className="text-3xl font-bold text-on-surface self-center font-headline">جمع البيانات</h2>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-xl space-y-4 text-on-surface-variant leading-relaxed">
                  <p>نجمع البيانات التي تقدمها مباشرة عند التسجيل أو البحث أو التواصل. وتشمل:</p>
                  <ul className="list-disc me-6 space-y-2">
                    <li>بيانات الهوية: الاسم وتفاصيل التحقق الجامعي.</li>
                    <li>بيانات التواصل: البريد الإلكتروني ورقم الهاتف.</li>
                    <li>بيانات أكاديمية: الجامعة وحالة القيد.</li>
                    <li>بيانات تفضيلات: سلوك البحث وتفضيلات السكن.</li>
                  </ul>
                </div>
              </section>

              <section className="scroll-mt-32" id="use-of-info">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">insights</span>
                  </div>
                  <h2 className="text-3xl font-bold text-on-surface self-center font-headline">استخدام المعلومات</h2>
                </div>
                <div className="bg-surface-container-low p-8 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface-container-lowest p-6 rounded-xl">
                      <h4 className="font-bold text-on-surface mb-2 font-headline">تقديم الخدمة</h4>
                      <p className="text-sm text-on-surface-variant">ربطك بملاك موثقين وتنظيم طلبات المعاينة والحجز.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl">
                      <h4 className="font-bold text-on-surface mb-2 font-headline">التخصيص</h4>
                      <p className="text-sm text-on-surface-variant">اقتراح سكن مناسب حسب تفضيلاتك وموقع الجامعة.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl">
                      <h4 className="font-bold text-on-surface mb-2 font-headline">الأمان</h4>
                      <p className="text-sm text-on-surface-variant">التحقق من الهويات للحفاظ على مجتمع سكني آمن.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-6 rounded-xl">
                      <h4 className="font-bold text-on-surface mb-2 font-headline">التواصل</h4>
                      <p className="text-sm text-on-surface-variant">إرسال تحديثات مهمة مرتبطة بطلباتك أو حسابك.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="scroll-mt-32" id="cookies">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">cookie</span>
                  </div>
                  <h2 className="text-3xl font-bold text-on-surface self-center font-headline">سياسة ملفات الارتباط</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl">
                    <h3 className="text-xl font-bold mb-4 font-headline">الكوكيز الأساسية</h3>
                    <p className="text-on-surface-variant leading-relaxed">تُستخدم لضمان عمل الموقع بشكل صحيح، مثل تسجيل الدخول الآمن وحفظ الجلسة.</p>
                  </div>
                  <div className="bg-primary p-8 rounded-xl text-white flex flex-col justify-between">
                    <span className="material-symbols-outlined text-4xl mb-4">tune</span>
                    <h3 className="text-lg font-bold font-headline">التفضيلات</h3>
                    <p className="text-xs text-on-primary-container mt-2">يمكنك إدارة إعدادات الكوكيز من حسابك في أي وقت.</p>
                  </div>
                </div>
              </section>

              <section className="scroll-mt-32" id="third-party">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">share</span>
                  </div>
                  <h2 className="text-3xl font-bold text-on-surface self-center font-headline">المشاركة مع أطراف خارجية</h2>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-xl border-r-8 border-tertiary-container">
                  <p className="text-on-surface-variant leading-relaxed mb-6">لا نبيع بياناتك الإعلانية. تتم المشاركة فقط مع:</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-medium">ملاك موثقين عند طلب المعاينة أو التقديم.</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-medium">مزودي البنية السحابية لتخزين البيانات بشكل آمن.</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="font-medium">الجهات القانونية عند وجود التزام نظامي.</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="scroll-mt-32" id="security">
                <div className="bg-primary text-white rounded-xl p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-headline">أمن بياناتك أولوية</h2>
                  <p className="text-primary-fixed leading-relaxed mb-8 text-sm md:text-base">
                    نطبق تشفيرًا قويًا للبيانات المخزنة والمنقولة، مع مراجعات أمنية دورية للحفاظ على أعلى مستوى من الحماية.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                      <p className="text-xs uppercase tracking-widest text-primary-fixed-dim mb-1">التشفير</p>
                      <p className="font-bold">AES-256</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                      <p className="text-xs uppercase tracking-widest text-primary-fixed-dim mb-1">الامتثال</p>
                      <p className="font-bold">معايير حماية البيانات</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="scroll-mt-32" id="contact">
                <div className="bg-surface-container-high p-6 md:p-12 rounded-xl text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 font-headline">لديك أسئلة عن بياناتك؟</h2>
                  <p className="text-on-surface-variant mb-8 max-w-lg mx-auto text-sm md:text-base">فريق الخصوصية متاح لمساعدتك في فهم حقوقك وإدارة معلوماتك.</p>
                  <a className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 w-full sm:w-auto" href="mailto:privacy@hojra.com">
                    <span className="material-symbols-outlined">mail</span>
                    التواصل مع فريق الخصوصية
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
