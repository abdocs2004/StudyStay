import React, { useEffect, useState } from 'react';
import {
  getProperties,
  getFavoriteProperties,
  addFavoriteProperty,
  removeFavoriteProperty,
} from '../../property/property.service';
import type { Property } from '../../property/property.service';
import PropertyCard from '../../property/components/PropertyCard';
import { useAuth } from '../../../hooks/useAuth';

const SearchPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [university, setUniversity] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [availability, setAvailability] = useState('all');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const typeParam = type === 'all' ? '' : type === 'whole' ? 'شقة كاملة' : 'بنظام أفراد';
        const availabilityParam = availability === 'all' ? '' : availability;

        const params = {
          search: searchText || undefined,
          university: university || undefined,
          city: city || undefined,
          min_rent: minPrice || undefined,
          max_rent: maxPrice || undefined,
          rooms: rooms || undefined,
          bathrooms: bathrooms || undefined,
          min_area: minArea || undefined,
          max_area: maxArea || undefined,
          availability: availabilityParam || undefined,
          type: typeParam || undefined,
          sort,
        };

        const data = await getProperties(params);
        setProperties(data);
      } catch (error) {
        console.error('Error searching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchProperties, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchText, university, city, minPrice, maxPrice, rooms, bathrooms, minArea, maxArea, availability, type, sort]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavoriteIds = async () => {
      try {
        const favoriteProperties = await getFavoriteProperties();
        setFavoritePropertyIds(favoriteProperties.map((property) => property.id));
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      }
    };

    fetchFavoriteIds();
  }, [isAuthenticated]);

  const handleToggleFavorite = async (propertyId: number, currentlyFavorite: boolean) => {
    try {
      if (currentlyFavorite) {
        await removeFavoriteProperty(propertyId);
        setFavoritePropertyIds((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await addFavoriteProperty(propertyId);
        setFavoritePropertyIds((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 font-body">
        <section className="rounded-4xl bg-linear-to-br from-primary to-primary-container text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)] overflow-hidden relative">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Property Search</p>
            <h1 className="font-headline text-4xl md:text-5xl font-black leading-tight mb-4">ابحث عن السكن الجامعي المناسب</h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-2xl">
              تصفح العقارات المضافة من قبل الملاك وقم بفلترتها حسب الجامعة والسعر وعدد الغرف ونوع الإيجار.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8 items-start">
          <aside className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)] xl:sticky xl:top-28">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-headline text-xl font-bold">التصفية والبحث</h2>
              <span className="text-xs font-bold text-primary">{properties.length} نتيجة</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">البحث العام</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="ابحث باسم الجامعة أو المدينة أو الوصف"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">المدينة / المنطقة</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: القاهرة"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">الجامعة القريبة</label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="مثال: جامعة عين شمس"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">من السعر (ج.م)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">إلى السعر (ج.م)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="10000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">عدد الغرف</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    placeholder="مثال: 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">عدد الحمامات</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    placeholder="مثال: 1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">من مساحة (م²)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="0"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">إلى مساحة (م²)</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    type="number"
                    min="0"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    placeholder="150"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">التوفر</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="متاح">متاح</option>
                  <option value="مؤجر">مؤجر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">نوع السكن</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="whole">شقة كاملة</option>
                  <option value="shared">بنظام أفراد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">ترتيب النتائج</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">الأحدث أولًا</option>
                  <option value="oldest">الأقدم أولًا</option>
                  <option value="price_asc">الأرخص أولًا</option>
                  <option value="price_desc">الأغلى أولًا</option>
                  <option value="area_asc">المساحة الأصغر أولًا</option>
                  <option value="area_desc">المساحة الأكبر أولًا</option>
                </select>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-headline text-2xl font-bold">النتائج المتاحة</h2>
                <p className="text-on-surface-variant text-sm mt-1">شقق حقيقية معروضة من ملاك موثوقين بالكامل.</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-primary font-bold text-xl animate-pulse">
                جاري البحث وتحديث النتائج...
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-[1.75rem] bg-surface-container-lowest p-12 text-center text-on-surface-variant shadow-[0_12px_32px_rgba(20,27,43,0.06)] border">
                لم نجد أي شقق مطابقة لبحثك. جرب تغيير فلاتر التصفية!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={favoritePropertyIds.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
