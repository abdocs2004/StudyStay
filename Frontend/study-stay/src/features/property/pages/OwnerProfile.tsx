import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { updateProperty as updatePropertyApi, deleteProperty as deletePropertyApi, uploadPropertyImages as uploadPropertyImagesApi } from '../property.service';
import { resolveImageUrl } from '../../../utils/imageUrl';
import PropertyImageUploader from '../components/PropertyImageUploader';
import PropertyFeaturesPicker from '../components/PropertyFeaturesPicker';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  type ProfileData,
} from '../../dashboard/profile.service';
import ProfileCard from '../../dashboard/components/ProfileCard';
import ProfileForm from '../../dashboard/components/ProfileForm';

interface OwnerProperty {
  id: number;
  title: string;
  city: string;
  address: string;
  nearby_university: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  halls: number;
  size: number;
  type: string;
  occupancy: string;
  image: string;
  description: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
}

const OwnerProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    university: '',
    bio: '',
  });

  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyUniversity, setNearbyUniversity] = useState('');
  const [rooms, setRooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [halls, setHalls] = useState('0');
  const [size, setSize] = useState('');
  const [rent, setRent] = useState('');
  const [type, setType] = useState('شقة كاملة');
  const [propertyImageFiles, setPropertyImageFiles] = useState<File[]>([]);
  const [propertyFeatures, setPropertyFeatures] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const loadOwnerProfile = async () => {
    try {
      const [profileResponse, propertyResponse] = await Promise.all([
        getProfile(),
        api.get('/properties/owner/me'),
      ]);
      setProfile(profileResponse);
      setProperties(propertyResponse.data);
    } catch (loadError) {
      console.error('Error loading owner profile data:', loadError);
    } finally {
      setLoading(false);
      setPropertyLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormState({
        name: profile.name,
        phone: profile.phone || '',
        university: profile.university || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setMessage('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!profile) return;

    setSaving(true);
    setMessage('');
    setError('');

    let finalProfile: ProfileData;

    try {
      finalProfile = await updateProfile({
        name: formState.name,
        phone: formState.phone,
        university: null,
        bio: formState.bio || null,
      });
    } catch (submitError: unknown) {
      const messageText =
        (submitError as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'حدث خطأ أثناء تحديث الحساب.';
      setError(messageText);
      setSaving(false);
      return;
    }

    // Text fields are saved at this point — reflect that immediately even if
    // the image upload below fails, so a photo error never hides a
    // successful name/phone/bio update.
    setProfile(finalProfile);
    updateUser(finalProfile);

    if (selectedFile) {
      setUploadLoading(true);
      try {
        const withImage = await uploadProfileImage(selectedFile);
        finalProfile = withImage;
        setProfile(withImage);
        updateUser(withImage);
        setSelectedFile(null);
        setMessage('تم تحديث بيانات الحساب والصورة بنجاح.');
      } catch (imageError: unknown) {
        const imageMessageText =
          (imageError as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'تم حفظ بياناتك، لكن حدث خطأ أثناء رفع الصورة.';
        setError(imageMessageText);
      } finally {
        setUploadLoading(false);
      }
    } else {
      setMessage('تم تحديث بيانات الحساب بنجاح.');
    }

    setSaving(false);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !address || !nearbyUniversity || !rent || !description) {
      setFormError('الرجاء إدخال كافة الحقول الأساسية المطلوبة.');
      return;
    }

    if (propertyImageFiles.length < 3 || propertyImageFiles.length > 7) {
      setFormError('الرجاء رفع من 3 إلى 7 صور للعقار.');
      return;
    }

    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    try {
      const createResponse = await api.post('/properties', {
        title,
        description,
        city,
        address,
        nearby_university: nearbyUniversity,
        rent: parseFloat(rent),
        rooms: parseInt(rooms) || 1,
        bathrooms: parseInt(bathrooms) || 1,
        halls: parseInt(halls) || 0,
        size: parseInt(size) || 0,
        type,
        features: propertyFeatures,
      });

      const newPropertyId = createResponse.data.propertyId;
      await uploadPropertyImagesApi(newPropertyId, propertyImageFiles);

      setFormSuccess('تم إضافة العقار بنجاح!');
      setTitle('');
      setCity('');
      setAddress('');
      setNearbyUniversity('');
      setRooms('1');
      setBathrooms('1');
      setHalls('0');
      setSize('');
      setRent('');
      setPropertyImageFiles([]);
      setPropertyFeatures([]);
      setDescription('');
      const refreshedProperties = await api.get('/properties/owner/me');
      setProperties(refreshedProperties.data);
    } catch (error: unknown) {
      console.error(error);
      setFormError((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'حدث خطأ أثناء إضافة العقار.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    try {
      await deletePropertyApi(propertyId);
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (deleteError) {
      console.error('Error deleting property:', deleteError);
      window.alert('حدث خطأ أثناء حذف العقار.');
    }
  };

  const handleToggleOccupancy = async (property: OwnerProperty) => {
    const nextOccupancy = property.occupancy === 'غير متاح' ? 'متاح' : 'غير متاح';
    try {
      await updatePropertyApi(property.id, { occupancy: nextOccupancy });
      setProperties((prev) => prev.map((p) => (p.id === property.id ? { ...p, occupancy: nextOccupancy } : p)));
    } catch (toggleError) {
      console.error('Error updating property availability:', toggleError);
      window.alert('حدث خطأ أثناء تحديث حالة العقار.');
    }
  };

  const totalRent = properties.reduce((sum, p) => sum + p.rent, 0);
  const totalUnitsCount = properties.length;

  if (loading || propertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <div className="text-primary font-bold text-xl animate-pulse">جاري تحميل الملف الشخصي...</div>
      </div>
    );
  }

  const avatarText = user?.name ? user.name.charAt(0) : 'أ';

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl bg-linear-to-br from-primary to-primary-container text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)] font-body">
          <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Owner Profile</p>
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">لوحة تحكم وإدارة المالك</h1>
          <p className="max-w-2xl text-white/90 leading-relaxed">
            مرحباً بك {user?.name}. هنا يمكنك تحديث ملفك الشخصي، رفع صورة حساب آمنة، وإدارة عقاراتك بسهولة.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            {profile && <ProfileCard profile={profile} />}
            <ProfileForm
              profile={profile}
              formState={formState}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onFileChange={handleFileChange}
              uploadLoading={uploadLoading}
              saving={saving}
              message={message}
              error={error}
              showUniversity={false}
            />
          </div>

          <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-headline text-2xl font-bold">إضافة عقار جديد</h3>
                <p className="text-sm text-on-surface-variant mt-1">أضف شقة جديدة لتظهر مباشرة في نتائج بحث الطلاب.</p>
              </div>
              <Link to="/properties" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                معاينة صفحة العقارات
              </Link>
            </div>

            <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2 lg:col-span-1">
                عنوان الإعلان
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="شقة مفروشة قريبة من الجامعة"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                المدينة
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="القاهرة"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                الجامعة القريبة
                <input
                  type="text"
                  value={nearbyUniversity}
                  onChange={(e) => setNearbyUniversity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="جامعة القاهرة"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2 lg:col-span-2">
                العنوان التفصيلي
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="الحي، الشارع، رقم المبنى"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                الإيجار الشهري (ج.م)
                <input
                  type="number"
                  min="0"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="3500"
                  required
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                الغرف
                <input
                  type="number"
                  min="0"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                الحمامات
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                الصالات
                <input
                  type="number"
                  min="0"
                  value={halls}
                  onChange={(e) => setHalls(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                المساحة (م²)
                <input
                  type="number"
                  min="0"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant">
                نوع الوحدة
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                >
                  <option value="شقة كاملة">شقة كاملة</option>
                  <option value="بنظام أفراد">بنظام أفراد</option>
                </select>
              </label>
              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2 lg:col-span-3">
                صور العقار (من 3 إلى 7 صور) *
                <div className="mt-2">
                  <PropertyImageUploader files={propertyImageFiles} onFilesChange={setPropertyImageFiles} />
                </div>
              </label>

              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2 lg:col-span-3">
                المرافق المتاحة
                <div className="mt-2">
                  <PropertyFeaturesPicker selected={propertyFeatures} onChange={setPropertyFeatures} />
                </div>
              </label>

              <label className="block text-xs font-semibold text-on-surface-variant md:col-span-2 lg:col-span-3">
                الوصف
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none min-h-[90px]"
                  placeholder="اكتب وصفاً تفصيلياً للشقة، المرافق المتاحة، وشروط الإيجار."
                  required
                />
              </label>

              <div className="md:col-span-2 lg:col-span-3 flex items-center gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {submitLoading ? 'جاري الإضافة...' : 'إضافة العقار'}
                </button>
                {formSuccess && <span className="text-sm font-semibold text-emerald-600">{formSuccess}</span>}
                {formError && <span className="text-sm font-semibold text-rose-600">{formError}</span>}
              </div>
            </form>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
                  {avatarText}
                </div>
                <div>
                  <h2 className="font-headline text-2xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-on-surface-variant">مالك عقارات مسجل</p>
                  <p className="text-sm text-on-surface-variant">{user?.email}</p>
                  {user?.phone && <p className="text-sm text-on-surface-variant">الهاتف: {user.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-xs text-on-surface-variant">إجمالي الإيراد المتوقع</p>
                  <p className="font-black text-2xl text-primary">{totalRent.toLocaleString('en-US')} ج.م</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-xs text-on-surface-variant">عدد العقارات</p>
                  <p className="font-black text-2xl text-primary">{totalUnitsCount} وحدات</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-xs text-on-surface-variant">حالة الحساب</p>
                  <p className="font-black text-lg text-emerald-600 mt-1">موثق ونشط</p>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="font-headline text-2xl font-bold">الشقق المعروضة</h3>
                    <p className="text-sm text-on-surface-variant mt-1">إدارة الوحدات الحالية ومراجعة حالتها بسرعة.</p>
                  </div>
                  <Link to="/messages" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-95 transition-opacity">
                    صندوق الرسائل
                  </Link>
                </div>

                {properties.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant">
                    لا توجد شقق مضافة بعد. استخدم النموذج لإضافة أول شقة لك!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <article key={property.id} className="flex flex-col md:flex-row gap-4 rounded-2xl bg-surface-container-low p-4 border border-slate-100">
                        <img
                          src={resolveImageUrl(property.image) || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'}
                          alt={property.title}
                          className="h-40 md:h-28 md:w-40 w-full rounded-xl object-cover"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-headline text-lg font-bold text-slate-900">{property.title}</h4>
                              <p className="text-xs text-on-surface-variant">{property.address} | {property.city}</p>
                              <p className="text-xs text-indigo-600 font-bold mt-1">قريب من: {property.nearby_university}</p>
                            </div>
                            <div className="text-left shrink-0">
                              <p className="font-black text-primary">{property.rent.toLocaleString('en-US')} ج.م</p>
                              <p className="text-xs text-on-surface-variant">{property.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-slate-200/50">
                            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-secondary">
                              حالة الوحدة: {property.occupancy || 'متاح'}
                            </span>
                            {property.approval_status && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  property.approval_status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : property.approval_status === 'rejected'
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'bg-amber-50 text-amber-600'
                                }`}
                              >
                                {property.approval_status === 'approved'
                                  ? 'معتمد من الإدارة'
                                  : property.approval_status === 'rejected'
                                  ? 'مرفوض'
                                  : 'بانتظار المراجعة'}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-500">
                              {property.rooms} غرف | {property.bathrooms} حمام | {property.size} م²
                            </span>
                          </div>
                          {property.approval_status === 'rejected' && property.rejection_reason && (
                            <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">
                              سبب الرفض: {property.rejection_reason} — يمكنك تعديل العقار لإعادة إرساله للمراجعة.
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap pt-2">
                            <Link
                              to={`/properties/${property.id}`}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              عرض
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleToggleOccupancy(property)}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              {property.occupancy === 'غير متاح' ? 'تفعيل الإعلان' : 'إخفاء الإعلان'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProperty(property.id)}
                              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                <h3 className="font-headline text-2xl font-bold mb-4">إدارة سريعة</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/messages" className="rounded-2xl bg-surface-container-low p-4 text-center font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors">الرسائل</Link>
                  <Link to="/favorites" className="rounded-2xl bg-surface-container-low p-4 text-center font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors">مفضلة الطلاب</Link>
                  <Link to="/search" className="rounded-2xl bg-surface-container-low p-4 text-center font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors">تصفح العقارات</Link>
                  <Link to="/owner/home" className="rounded-2xl bg-surface-container-low p-4 text-center font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors">طلبات الطلاب</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
