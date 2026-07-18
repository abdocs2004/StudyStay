import React, { useState } from 'react';

const OPENINGS = [
  { title: 'مطوّر Full-Stack', type: 'دوام كامل · عن بُعد', dept: 'الهندسة' },
  { title: 'أخصائي دعم فني', type: 'دوام كامل · القاهرة', dept: 'الدعم' },
  { title: 'مسؤول تسويق رقمي', type: 'دوام جزئي · عن بُعد', dept: 'التسويق' },
];

const Careers: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', role: OPENINGS[0].title, message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-16">
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
            الوظائف
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4">انضم إلى فريق حُجرة</h1>
          <p className="text-lg text-on-surface-variant">نبني منصة تساعد آلاف الطلاب على إيجاد سكن آمن — وندعوك لتكون جزءاً من هذه الرحلة.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'groups', title: 'فريق شغوف', desc: 'تعمل مع فريق صغير يهتم فعلاً بالأثر الذي يصنعه' },
            { icon: 'trending_up', title: 'نمو حقيقي', desc: 'تحديات تقنية وتشغيلية حقيقية في منصة تنمو بسرعة' },
            { icon: 'schedule', title: 'مرونة في العمل', desc: 'خيارات عمل عن بُعد ومواعيد مرنة لمعظم الأدوار' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
              <span className="material-symbols-outlined text-2xl text-primary mb-3 block">{item.icon}</span>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-headline text-2xl font-bold mb-6">الوظائف المتاحة حالياً</h2>
          <div className="space-y-3">
            {OPENINGS.map((job) => (
              <div key={job.title} className="flex items-center justify-between rounded-2xl bg-surface-container-lowest px-6 py-4 shadow-sm">
                <div>
                  <h3 className="font-bold">{job.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{job.type} · {job.dept}</p>
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, role: job.title }))}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                >
                  تقديم
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface-container-lowest p-8 md:p-10">
          <h2 className="font-headline text-2xl font-bold mb-6">نموذج التقديم</h2>
          {submitted ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-emerald-500">task_alt</span>
              <p className="mt-4 font-bold">تم استلام طلبك بنجاح!</p>
              <p className="text-sm text-on-surface-variant mt-1">سنتواصل معك عبر البريد الإلكتروني إذا كان هناك تطابق مناسب.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block text-xs font-semibold text-on-surface-variant">
                الاسم الكامل
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                البريد الإلكتروني
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2">
                الوظيفة المتقدم لها
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  {OPENINGS.map((job) => (
                    <option key={job.title} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2">
                نبذة عنك / رابط CV
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none min-h-[90px]"
                />
              </label>
              <button
                type="submit"
                className="md:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover transition-colors"
              >
                إرسال الطلب
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default Careers;
