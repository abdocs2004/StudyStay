import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  type ProfileData,
} from '../profile.service';
import ProfileTabs from '../components/ProfileTabs';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';

const StudentProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    university: '',
    bio: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (loadError) {
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
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
    setError('');
    setMessage('');

    let finalProfile: ProfileData;

    try {
      finalProfile = await updateProfile({
        name: formState.name,
        phone: formState.phone,
        university: formState.university || null,
        bio: formState.bio || null,
      });
    } catch (submitError: unknown) {
      const messageText =
        (submitError as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'حدث خطأ أثناء حفظ الملف الشخصي.';
      setError(messageText);
      setSaving(false);
      return;
    }

    // Reflect the saved text fields immediately so a later image-upload
    // failure can never make it look like nothing was saved.
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
        setMessage('تم حفظ بيانات الملف الشخصي والصورة بنجاح.');
      } catch (imageError: unknown) {
        const imageMessageText =
          (imageError as { response?: { data?: { message?: string } } }).response?.data?.message ||
          'تم حفظ بياناتك، لكن حدث خطأ أثناء رفع الصورة.';
        setError(imageMessageText);
      } finally {
        setUploadLoading(false);
      }
    } else {
      setMessage('تم حفظ بيانات الملف الشخصي بنجاح.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-24">
        <div className="text-primary font-bold text-xl animate-pulse">جاري تحميل الملف الشخصي...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'edit', label: 'تعديل الحساب' },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl bg-linear-to-br from-primary to-primary-container text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)]">
          <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Student Profile</p>
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">بروفايل الطالب المستأجر</h1>
          <p className="max-w-2xl text-white/90 leading-relaxed">
            مرحباً {user?.name}. هنا يمكنك إدارة معلومات ملفك الشخصي، رؤية بيانات حسابك، ورفع صورة جديدة بأمان.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8">
          <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)] space-y-6">
            <ProfileTabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />

            {activeTab === 'overview' ? (
              <div className="grid gap-6 xl:grid-cols-[0.9fr_0.95fr]">
                {profile && <ProfileCard profile={profile} />}
                <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-xl mb-4">روابط سريعة</h3>
                  <div className="grid gap-3">
                    <Link
                      to="/favorites"
                      className="rounded-3xl bg-primary px-5 py-4 text-white font-semibold text-center"
                    >
                      المفضلة
                    </Link>
                    <Link
                      to="/messages"
                      className="rounded-3xl bg-surface-container-high px-5 py-4 text-primary font-semibold text-center"
                    >
                      الصندوق الوارد
                    </Link>
                    <Link
                      to="/bookings"
                      className="rounded-3xl bg-surface-container-high px-5 py-4 text-primary font-semibold text-center"
                    >
                      الحجوزات
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
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
                showUniversity={true}
              />
            )}
          </div>

          <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <h3 className="font-headline text-2xl font-bold mb-4">ملاحظات عامة</h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p>يمكنك تعديل الاسم، رقم الهاتف، الجامعة، والنبذة الخاصة بك هنا. سيظهر التحديث فوراً في ملفك الشخصي.</p>
              <p>صورة الملف الشخصي تحفظ كمسار نسبي في قاعدة البيانات وتخزن فعلياً داخل المجلد الخلفي.</p>
              <p>لا يمكنك تعديل ملف مستخدم آخر، فقط بيانات حسابك الحالي محفوظة بأمان.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
