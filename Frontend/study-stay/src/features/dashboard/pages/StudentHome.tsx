import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import MyUnlockRequests from '../../payments/components/MyUnlockRequests';
import MyReviewsWidget from '../../reviews/components/MyReviewsWidget';

interface Property {
  id: number;
  title: string;
  city: string;
  rent: number;
  image: string;
  type: string;
  occupancy: string;
}

interface Post {
  id: number;
  property_id: number | null;
  property_title?: string;
  property_city?: string;
  university: string;
  city: string;
  preferred_area: string;
  budget: number;
  rooms: number;
  bathrooms: number;
  area: number;
  description: string;
  status: string;
  created_at: string;
}

const initialFormState = {
  university: '',
  city: '',
  preferredArea: '',
  budget: '',
  rooms: '1',
  bathrooms: '1',
  area: '',
  description: '',
  propertyId: '',
};

const StudentHome: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      const [propsRes, postsRes] = await Promise.all([
        api.get('/properties'),
        api.get('/posts/student/me'),
      ]);
      setProperties(propsRes.data);
      setPosts(postsRes.data);
      if (propsRes.data.length > 0 && selectedPropertyId === null) {
        setSelectedPropertyId(propsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error loading student home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingPostId(null);
    setFormError('');
  };

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (
      !form.university.trim() ||
      !form.city.trim() ||
      !form.budget.trim() ||
      !form.rooms.trim() ||
      !form.bathrooms.trim() ||
      !form.area.trim() ||
      !form.description.trim()
    ) {
      setFormError('جميع الحقول المطلوبة يجب أن تكون ممتلئة.');
      return false;
    }

    const budget = parseFloat(form.budget);
    const rooms = parseInt(form.rooms, 10);
    const bathrooms = parseInt(form.bathrooms, 10);
    const area = parseInt(form.area, 10);

    if (Number.isNaN(budget) || budget <= 0) {
      setFormError('الرجاء إدخال قيمة ميزانية صحيحة أكبر من 0.');
      return false;
    }
    if (Number.isNaN(rooms) || rooms <= 0) {
      setFormError('الرجاء إدخال عدد غرف صحيح.');
      return false;
    }
    if (Number.isNaN(bathrooms) || bathrooms <= 0) {
      setFormError('الرجاء إدخال عدد حمامات صحيح.');
      return false;
    }
    if (Number.isNaN(area) || area <= 0) {
      setFormError('الرجاء إدخال مساحة صحيحة.');
      return false;
    }

    return true;
  };

  const refreshPosts = async () => {
    try {
      const postsRes = await api.get('/posts/student/me');
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error refreshing student posts:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      university: form.university.trim(),
      city: form.city.trim(),
      preferred_area: form.preferredArea.trim() || null,
      budget: form.budget,
      rooms: form.rooms,
      bathrooms: form.bathrooms,
      area: form.area,
      description: form.description.trim(),
      property_id: form.propertyId ? Number(form.propertyId) : null,
    };

    try {
      if (editingPostId) {
        await api.put(`/posts/${editingPostId}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      resetForm();
      refreshPosts();
    } catch (error) {
      console.error('Error saving request:', error);
      setFormError('حدث خطأ أثناء حفظ الطلب. حاول مرة أخرى.');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setForm({
      university: post.university || '',
      city: post.city || '',
      preferredArea: post.preferred_area || '',
      budget: String(post.budget),
      rooms: String(post.rooms),
      bathrooms: String(post.bathrooms),
      area: String(post.area),
      description: post.description || '',
      propertyId: post.property_id ? String(post.property_id) : '',
    });
    setSelectedPropertyId(post.property_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }

    try {
      await api.delete(`/posts/${id}`);
      refreshPosts();
      if (editingPostId === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const togglePostStatus = async (post: Post) => {
    const nextStatus = post.status === 'active' ? 'closed' : 'active';
    try {
      await api.put(`/posts/${post.id}`, { status: nextStatus });
      refreshPosts();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <div className="text-primary font-bold text-xl animate-pulse">جاري تحميل البيانات...</div>
      </div>
    );
  }

  const avatarText = user?.name ? user.name.charAt(0) : 'ط';

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
              {avatarText}
            </div>
            <div>
              <p className="font-headline text-2xl font-bold">{user?.name}</p>
              <p className="text-sm text-on-surface-variant">{user?.email} {user?.university ? `| ${user.university}` : ''}</p>
            </div>
          </div>

          <Link
            to="/messages"
            className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            الرسائل
          </Link>
        </div>

        <MyUnlockRequests />

        <MyReviewsWidget />

        <div className="space-y-3">
          <h1 className="font-headline text-4xl md:text-5xl font-black">My Housing Requests</h1>
          <p className="text-on-surface-variant">أنشئ وادِر طلبات السكن الخاصة بك من هنا. يمكنك التعديل، الحذف، أو إغلاق الطلب وإعادة فتحه لاحقًا.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <section className="space-y-6">
            <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-headline text-2xl font-bold">{editingPostId ? 'تعديل الطلب' : 'إنشاء طلب جديد'}</h2>
                  <p className="text-on-surface-variant text-sm mt-1">املأ البيانات الأساسية للطلب حتى يتمكن الملاك من رؤية متطلباتك بوضوح.</p>
                </div>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء التعديل
                  </button>
                )}
              </div>

              {formError && (
                <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 mb-6">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">الجامعة</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    value={form.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="مثال: الجامعة الأمريكية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">المدينة</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    value={form.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="مثال: القاهرة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">المنطقة المفضلة</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    value={form.preferredArea}
                    onChange={(e) => handleInputChange('preferredArea', e.target.value)}
                    placeholder="مثال: التجمع الخامس"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">الميزانية (ج.م)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="0"
                    value={form.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="مثال: 4500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">عدد الغرف</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="1"
                    value={form.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    placeholder="مثال: 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">عدد الحمامات</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="1"
                    value={form.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    placeholder="مثال: 1"
                  />
                </div>
                <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold mb-2">المساحة (م²)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="0"
                    value={form.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="مثال: 80"
                  />
                </div>
                <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold mb-2">الوصف</label>
                  <textarea
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none min-h-[140px]"
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="صف احتياجاتك بالتفصيل..."
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto rounded-2xl bg-primary px-6 py-4 font-bold text-white hover:opacity-95 transition-opacity"
                >
                  {editingPostId ? 'حفظ التعديلات' : 'نشر الطلب'}
                </button>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </div>

            <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-headline text-2xl font-bold">طلباتك الحالية</h2>
                  <p className="text-on-surface-variant text-sm mt-1">يمكنك تعديل أو حذف أو إغلاق أي طلب قمت بإنشائه.</p>
                </div>
                <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">{posts.length} طلب</span>
              </div>

              {posts.length === 0 ? (
                <div className="rounded-3xl bg-white p-8 text-center text-on-surface-variant">
                  لم تقم بإنشاء أي طلبات بعد.
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-slate-600">{post.status === 'active' ? 'نشط' : 'مغلق'}</span>
                            <span className="text-xs text-on-surface-variant">{new Date(post.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900">{post.university} - {post.city}</h3>
                          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{post.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
                          <span className="rounded-full bg-surface-container px-3 py-2">المنطقة: {post.preferred_area || 'غير محددة'}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">الميزانية: {Number(post.budget).toLocaleString('en-US')} ج.م</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">الغرف: {post.rooms}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">الحمامات: {post.bathrooms}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">المساحة: {post.area} م²</span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(post)}
                            className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            حذف
                          </button>
                          <button
                            type="button"
                            onClick={() => togglePostStatus(post)}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {post.status === 'active' ? 'إغلاق الطلب' : 'إعادة الفتح'}
                          </button>
                        </div>
                        <Link
                          to={`/posts/${post.id}`}
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <h3 className="font-headline text-2xl font-bold mb-4">عقارات مقترحة</h3>
              <p className="text-on-surface-variant text-sm mb-6">اختر عقارك المفضل لتلقي طلبات أكثر دقة من الملاك.</p>
              <div className="space-y-4">
                {properties.length === 0 ? (
                  <p className="text-on-surface-variant">لا توجد عقارات مقترحة حالياً.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-slate-900">{property.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">{property.city} • {property.type}</p>
                        <p className="mt-3 text-sm text-slate-700">{property.occupancy || 'متاح'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
