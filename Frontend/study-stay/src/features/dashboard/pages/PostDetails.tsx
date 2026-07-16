import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { getUnlockStatus } from '../../payments/payment.service';
import UnlockContactModal from '../../payments/components/UnlockContactModal';
import LockedInfo from '../../payments/components/LockedInfo';

interface PostDetailsModel {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  property_id: number | null;
  property_title?: string;
  property_city?: string;
  university: string;
  city: string;
  preferred_area?: string;
  budget: number;
  rooms: number;
  bathrooms: number;
  area: number;
  description: string;
  status: string;
  created_at: string;
}

const PostDetails: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetailsModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setError('معرّف الطلب غير موجود.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        console.error('Error loading post details:', err);
        setError('تعذر جلب تفاصيل الطلب. حاول مرة أخرى لاحقاً.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  useEffect(() => {
    const checkUnlock = async () => {
      if (!post || user?.role !== 'owner') return;
      try {
        const isUnlocked = await getUnlockStatus(post.student_id);
        setUnlocked(isUnlocked);
      } catch (unlockError) {
        console.error('Error checking unlock status:', unlockError);
      }
    };
    checkUnlock();
  }, [post, user?.role]);

  const contactVisible = unlocked || user?.role !== 'owner' || user?.id === post?.student_id;

  const handleContact = async () => {
    if (!post || user?.role !== 'owner') {
      return;
    }

    try {
      await api.post('/chats/conversations', {
        student_id: post.student_id,
        owner_id: user.id,
        property_id: post.property_id,
      });
      navigate(`/messages?userId=${post.student_id}&propertyId=${post.property_id ?? ''}`);
    } catch (err) {
      console.error('Error opening conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-16 flex items-center justify-center">
        <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
          <p className="text-lg font-bold text-primary animate-pulse">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <div className="rounded-[1.75rem] bg-surface-container-lowest p-10 shadow-[0_12px_32px_rgba(20,27,43,0.06)] text-center">
            <p className="text-xl font-bold text-slate-900">تعذر عرض تفاصيل الطلب</p>
            <p className="mt-4 text-on-surface-variant">{error || 'الطلب غير موجود.'}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-headline text-4xl font-black">تفاصيل طلب السكن</h1>
            <p className="text-on-surface-variant mt-2">عرض كامل لمتطلبات الطالب بالإضافة إلى حالة الطلب.</p>
          </div>
          <Link
            to={user?.role === 'owner' ? '/owner/home' : '/dashboard'}
            className="rounded-full bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            العودة إلى القائمة
          </Link>
        </div>

        <div className="rounded-[1.75rem] bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="font-bold text-2xl text-slate-900">{post.university} - {post.city}</h2>
                    <p className="text-sm text-on-surface-variant mt-2">المنطقة المفضلة: {post.preferred_area || 'غير محددة'}</p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-bold ${post.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {post.status === 'active' ? 'نشط' : 'مغلق'}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-700">
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <span className="block text-on-surface-variant">الميزانية</span>
                    <span className="font-bold">{Number(post.budget).toLocaleString('en-US')} ج.م</span>
                  </div>
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <span className="block text-on-surface-variant">المساحة</span>
                    <span className="font-bold">{post.area} م²</span>
                  </div>
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <span className="block text-on-surface-variant">الغرف</span>
                    <span className="font-bold">{post.rooms}</span>
                  </div>
                  <div className="rounded-2xl bg-surface-container px-4 py-3">
                    <span className="block text-on-surface-variant">الحمامات</span>
                    <span className="font-bold">{post.bathrooms}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">الوصف</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{post.description}</p>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-900">معلومات الطالب</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div>
                    <span className="block text-on-surface-variant">الاسم</span>
                    <span className="font-semibold">{post.student_name}</span>
                  </div>
                  {contactVisible ? (
                    <>
                      <div>
                        <span className="block text-on-surface-variant">البريد الإلكتروني</span>
                        <span className="font-semibold">{post.student_email}</span>
                      </div>
                      <div>
                        <span className="block text-on-surface-variant">رقم الهاتف</span>
                        <span className="font-semibold">{post.student_phone || 'غير متوفر'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <LockedInfo label="البريد الإلكتروني" onUnlockClick={() => setShowUnlockModal(true)} />
                      <LockedInfo label="رقم الهاتف" onUnlockClick={() => setShowUnlockModal(true)} />
                    </div>
                  )}
                  {post.property_title && (
                    <div>
                      <span className="block text-on-surface-variant">العقار المرتبط</span>
                      <span className="font-semibold">{post.property_title} - {post.property_city}</span>
                    </div>
                  )}
                </div>
              </div>

              {user?.role === 'owner' && (
                <button
                  type="button"
                  onClick={handleContact}
                  className="w-full rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white hover:opacity-95 transition-opacity"
                >
                  مراسلة الطالب
                </button>
              )}
            </aside>
          </div>
        </div>
      </div>

      {showUnlockModal && post && (
        <UnlockContactModal
          targetUserId={post.student_id}
          targetName={post.student_name}
          postId={post.id}
          onClose={() => setShowUnlockModal(false)}
          onSubmitted={() => {}}
        />
      )}
    </div>
  );
};

export default PostDetails;
