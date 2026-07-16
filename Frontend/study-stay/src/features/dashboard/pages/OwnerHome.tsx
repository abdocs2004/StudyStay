import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import MyUnlockRequests from '../../payments/components/MyUnlockRequests';
import OwnerDashboardStats from '../components/OwnerDashboardStats';

interface Post {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_university: string;
  property_id: number | null;
  property_title?: string;
  property_city?: string;
  university: string;
  city: string;
  description: string;
  preferred_area?: string;
  budget?: number;
  rooms?: number;
  bathrooms?: number;
  area?: number;
  created_at: string;
}

const OwnerHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    university: '',
    city: '',
    minBudget: '',
    maxBudget: '',
    rooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    sort: 'newest',
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/posts', {
        params: {
          university: filters.university || undefined,
          city: filters.city || undefined,
          min_budget: filters.minBudget || undefined,
          max_budget: filters.maxBudget || undefined,
          rooms: filters.rooms || undefined,
          bathrooms: filters.bathrooms || undefined,
          min_area: filters.minArea || undefined,
          max_area: filters.maxArea || undefined,
          sort: filters.sort || undefined,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching student posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleMessage = async (post: Post) => {
    try {
      await api.post('/chats/conversations', {
        student_id: post.student_id,
        owner_id: user?.id,
        property_id: post.property_id,
      });
    } catch (error) {
      console.error('Error ensuring conversation exists:', error);
    }
    navigate(`/messages?userId=${post.student_id}&propertyId=${post.property_id ?? ''}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <div className="text-primary font-bold text-xl animate-pulse">جاري تحميل طلبات الطلاب...</div>
      </div>
    );
  }

  const avatarText = user?.name ? user.name.charAt(0) : 'م';

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Top-left Profile */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
              {avatarText}
            </div>
            <div>
              <p className="font-headline text-2xl font-bold">{user?.name}</p>
              <p className="text-sm text-on-surface-variant">{user?.email}</p>
            </div>
          </div>

          <Link
            to="/owner/profile"
            className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            إدارة شققي (البروفايل)
          </Link>
        </div>

        <MyUnlockRequests />

        <OwnerDashboardStats />

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <section className="space-y-6">
            <header>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="font-headline text-4xl md:text-5xl font-black">Student Requests</h1>
                  <p className="text-on-surface-variant mt-2">تصفية طلبات الطلاب النشطة حسب الجامعة والمدينة والميزانية.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    الجامعة
                    <input
                      type="text"
                      value={filters.university}
                      onChange={(e) => setFilters((prev) => ({ ...prev, university: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="الجامعة"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    المدينة
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="المدينة"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    الميزانية من
                    <input
                      type="number"
                      value={filters.minBudget}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minBudget: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="0"
                    />
                  </label>
                  <label className="block text-xs font-semibold text-on-surface-variant">
                    الميزانية إلى
                    <input
                      type="number"
                      value={filters.maxBudget}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxBudget: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="10000"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block text-xs font-semibold text-on-surface-variant">
                  الغرف
                  <input
                    type="number"
                    min="0"
                    value={filters.rooms}
                    onChange={(e) => setFilters((prev) => ({ ...prev, rooms: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="عدد الغرف"
                  />
                </label>
                <label className="block text-xs font-semibold text-on-surface-variant">
                  الحمامات
                  <input
                    type="number"
                    min="0"
                    value={filters.bathrooms}
                    onChange={(e) => setFilters((prev) => ({ ...prev, bathrooms: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="عدد الحمامات"
                  />
                </label>
                <label className="block text-xs font-semibold text-on-surface-variant">
                  المساحة
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="number"
                      min="0"
                      value={filters.minArea}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minArea: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="من"
                    />
                    <input
                      type="number"
                      min="0"
                      value={filters.maxArea}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxArea: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="إلى"
                    />
                  </div>
                </label>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-between mt-4">
                <label className="block text-xs font-semibold text-on-surface-variant">
                  ترتيب
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  >
                    <option value="newest">الأحدث أولًا</option>
                    <option value="oldest">الأقدم أولًا</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setFilters({
                    university: '',
                    city: '',
                    minBudget: '',
                    maxBudget: '',
                    rooms: '',
                    bathrooms: '',
                    minArea: '',
                    maxArea: '',
                    sort: 'newest',
                  })}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  مسح الفلاتر
                </button>
              </div>
            </header>

            {posts.length === 0 ? (
              <div className="rounded-[1.75rem] bg-surface-container-lowest p-8 text-center text-on-surface-variant shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                لا توجد طلبات سكن نشطة من الطلاب حالياً.
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)] border border-slate-100 hover:border-indigo-100 transition-colors">
                    <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-bold shrink-0">
                            {post.student_name.charAt(0)}
                          </div>
                          <div>
                            <h2 className="font-headline text-lg font-bold text-slate-900">{post.student_name}</h2>
                            <p className="text-xs text-on-surface-variant">{post.student_university}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-700">
                          <span className="rounded-full bg-surface-container px-3 py-2">الجامعة: {post.university}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">المدينة: {post.city}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">المنطقة: {post.preferred_area || 'غير محددة'}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-700">
                          <span className="rounded-full bg-surface-container px-3 py-2">الميزانية: {Number(post.budget).toLocaleString('en-US')} ج.م</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">الغرف: {post.rooms}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">الحمامات: {post.bathrooms}</span>
                          <span className="rounded-full bg-surface-container px-3 py-2">المساحة: {post.area} م²</span>
                        </div>

                        <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{post.description}</p>
                      </div>

                      <div className="flex flex-col gap-3 justify-between">
                        <div className="rounded-3xl bg-primary/5 px-4 py-3 text-xs font-bold text-primary text-right">{new Date(post.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handleMessage(post)}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-95 transition-opacity"
                          >
                            Contact Student
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/posts/${post.id}`)}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <h3 className="font-headline text-2xl font-bold mb-4">كيف تعمل المنصة للملاك؟</h3>
              <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0">١</span>
                  <p>تصفح طلبات الطلاب المعروضة في هذه الصفحة مباشرة.</p>
                </div>
                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0">٢</span>
                  <p>عندما تجد طالباً مهتماً بشقتك أو يبحث عن مواصفات شقتك، اضغط على <strong>مراسلة الطالب</strong>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0">٣</span>
                  <p>تحدث مع الطالب في شات مباشر للاتفاق وتأكيد حجز الشقة.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <h3 className="font-headline text-2xl font-bold mb-3">حساب موثق</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                جميع الطلاب المسجلين بالمنصة مسجلين ببريدهم الإلكتروني الجامعي ووثائقهم لضمان الأمان والجدية في التعامل.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
