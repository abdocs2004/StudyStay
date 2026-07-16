import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPropertyById, type Property } from '../../property/property.service';
import { resolveImageUrls } from '../../../utils/imageUrl';
import { useAuth } from '../../../hooks/useAuth';
import { getUnlockStatus } from '../../payments/payment.service';
import UnlockContactModal from '../../payments/components/UnlockContactModal';
import LockedInfo from '../../payments/components/LockedInfo';
import PropertyGallery from '../components/PropertyGallery';
import PropertyFeaturesDisplay from '../components/PropertyFeaturesDisplay';
import PropertyReviews from '../components/PropertyReviews';
import StarRating from '../../reviews/components/StarRating';
import { getOwnerReviews, type ReviewsSummary } from '../../reviews/reviews.service';

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [ownerReviews, setOwnerReviews] = useState<ReviewsSummary | null>(null);

  useEffect(() => {
    if (!propertyId) {
      setError('معرّف العقار غير موجود');
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (fetchError) {
        console.error('Error fetching property details:', fetchError);
        setError('حدث خطأ أثناء جلب بيانات العقار. حاول مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    const loadOwnerReviews = async () => {
      if (!property) return;
      try {
        const data = await getOwnerReviews(property.owner_id);
        setOwnerReviews(data);
      } catch (reviewError) {
        console.error('Error loading owner reviews:', reviewError);
      }
    };
    loadOwnerReviews();
  }, [property]);

  useEffect(() => {
    const checkUnlock = async () => {
      if (!isAuthenticated || !property || user?.id === property.owner_id) return;
      try {
        const isUnlocked = await getUnlockStatus(property.owner_id);
        setUnlocked(isUnlocked);
      } catch (unlockError) {
        console.error('Error checking unlock status:', unlockError);
      }
    };
    checkUnlock();
  }, [isAuthenticated, property, user?.id]);

  const isOwnProperty = isAuthenticated && user?.id === property?.owner_id;
  const contactVisible = unlocked || isOwnProperty;

  const images = resolveImageUrls(property?.images?.length ? property.images : property?.image ? [property.image] : []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-16 flex items-center justify-center">
        <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
          <p className="text-lg font-bold text-primary animate-pulse">جاري تحميل تفاصيل العقار...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <div className="rounded-[1.75rem] bg-surface-container-lowest p-10 shadow-[0_12px_32px_rgba(20,27,43,0.06)] text-center">
            <p className="text-xl font-bold text-slate-900">تعذر عرض تفاصيل العقار</p>
            <p className="mt-4 text-on-surface-variant">{error || 'لم يتم العثور على العقار المطلوب.'}</p>
            <Link
              to="/properties"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              العودة للبحث
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl overflow-hidden bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.06)] border border-white/60">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="p-4 lg:p-6 space-y-4">
              <PropertyGallery images={images} title={property.title} />
            </div>

            <div className="p-6 lg:p-10 bg-linear-to-br from-white to-surface-container-low space-y-6">
              <div>
                <p className="text-sm font-bold tracking-[0.28em] uppercase text-primary">معرّف العقار: {property.id}</p>
                <h1 className="font-headline text-4xl font-black mt-3">{property.title}</h1>
                <p className="text-on-surface-variant mt-2">
                  {contactVisible ? property.address : `${property.city} (العنوان الكامل مقفل)`}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-3xl font-black text-primary">{Number(property.rent).toLocaleString('en-US')} ج.م</div>
                <div className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold">{property.type}</div>
                <div className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold">{property.occupancy || 'متاح'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-on-surface-variant">المساحة</p>
                  <p className="font-bold text-lg">{property.size} م²</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-on-surface-variant">الغرف</p>
                  <p className="font-bold text-lg">{property.rooms}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-on-surface-variant">الحمامات</p>
                  <p className="font-bold text-lg">{property.bathrooms}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-on-surface-variant">الصالات</p>
                  <p className="font-bold text-lg">{property.halls ?? 0}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-primary/5 p-4 space-y-2">
                <p className="font-bold text-primary">قرب الجامعة</p>
                <p className="text-sm text-on-surface-variant">{property.city} - {property.nearby_university}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/favorites"
                  className="rounded-full bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm"
                >
                  إضافة للمفضلة
                </Link>
                <Link
                  to={`/messages?userId=${property.owner_id}&propertyId=${property.id}`}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm"
                >
                  مراسلة المالك
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
          <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <h2 className="font-headline text-2xl font-bold mb-4">تفاصيل الوحدة</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">{property.description}</p>
            {property.features && property.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-headline text-lg font-bold mb-3">المرافق المتاحة</h3>
                <PropertyFeaturesDisplay features={property.features} />
              </div>
            )}
            <PropertyReviews propertyId={property.id} ownerId={property.owner_id} />
          </section>

          <aside className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)] space-y-5">
            <div>
              <h3 className="font-headline text-xl font-bold mb-2">مالك الوحدة</h3>
              <p className="text-slate-900 font-semibold">{property.owner_name}</p>
              {ownerReviews && ownerReviews.totalReviews > 0 && (
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <StarRating value={Math.round(ownerReviews.averageRating)} size="text-sm" />
                  <span className="text-xs font-bold text-slate-600">
                    {ownerReviews.averageRating} ({ownerReviews.totalReviews} تقييم)
                  </span>
                </div>
              )}
              {contactVisible ? (
                <>
                  <p className="text-on-surface-variant text-sm">{property.owner_phone}</p>
                  <p className="text-on-surface-variant text-sm">{property.owner_email}</p>
                </>
              ) : (
                <div className="mt-2 space-y-2">
                  <LockedInfo label="رقم الهاتف" onUnlockClick={() => (isAuthenticated ? setShowUnlockModal(true) : (window.location.href = '/login'))} />
                  <LockedInfo label="البريد الإلكتروني" onUnlockClick={() => (isAuthenticated ? setShowUnlockModal(true) : (window.location.href = '/login'))} />
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-primary/5 p-4">
              <p className="font-bold text-primary mb-1">رسوم المنصة</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">يتم خصم 2.5% من قيمة الإيجار كرسوم خدمة على المنصة من عملية الحجز.</p>
            </div>

            <div className="space-y-2 text-sm text-on-surface-variant">
              <p>• السعر الشهري: {Number(property.rent).toLocaleString('en-US')} ج.م</p>
              <p>• نوع الوحدة: {property.type}</p>
              <p>• موقع قريب من: {property.nearby_university}</p>
              <p>• العنوان: {contactVisible ? property.address : '🔒 مقفل حتى الموافقة على الدفع'}</p>
            </div>
          </aside>
        </div>
      </div>

      {showUnlockModal && property && (
        <UnlockContactModal
          targetUserId={property.owner_id}
          targetName={property.owner_name}
          propertyId={property.id}
          rent={Number(property.rent)}
          onClose={() => setShowUnlockModal(false)}
          onSubmitted={() => {}}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
