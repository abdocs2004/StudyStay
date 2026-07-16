import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavoriteProperties, removeFavoriteProperty } from '../../property/property.service';
import type { Property } from '../../property/property.service';
import { resolveImageUrl } from '../../../utils/imageUrl';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const favoriteProperties = await getFavoriteProperties();
        setFavorites(favoriteProperties);
      } catch (error) {
        console.error('Error loading favorite properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await removeFavoriteProperty(id);
      setFavorites((previous) => previous.filter((property) => property.id !== id));
    } catch (error) {
      console.error('Error removing favorite property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl bg-linear-to-br from-secondary to-secondary-container text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)]">
          <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Favorites</p>
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">الشقق المفضلة عند الطلاب</h1>
          <p className="max-w-2xl text-white/90 leading-relaxed">احفظ الشقق التي تناسبك وارجع إليها في أي وقت مع مقارنة سريعة بين أفضل الاختيارات.</p>
        </section>

        {loading ? (
          <div className="rounded-[1.75rem] bg-surface-container-lowest p-10 text-center shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <h2 className="font-headline text-2xl font-bold mb-3">جاري تحميل المفضلة...</h2>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-[1.75rem] bg-surface-container-lowest p-10 text-center shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
            <h2 className="font-headline text-2xl font-bold mb-3">لا توجد شقق مفضلة حاليًا</h2>
            <p className="text-on-surface-variant mb-6">تصفح صفحة البحث وأضف ما يعجبك إلى المفضلة.</p>
            <Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white">
              الذهاب إلى البحث
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((property) => (
              <article key={property.id} className="rounded-[1.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
                <img src={resolveImageUrl(property.main_image || property.image) || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'} alt={property.title} className="h-60 w-full object-cover" />
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-headline text-2xl font-bold">{property.title}</h3>
                      <p className="text-sm text-on-surface-variant mt-1">{property.city} - {property.nearby_university}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black text-primary">{Number(property.rent).toLocaleString('en-US')} ج.م</p>
                      <p className="text-xs text-on-surface-variant">شهريًا</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap text-xs font-bold text-on-surface-variant">
                    <span className="rounded-full bg-surface-container px-3 py-1">{property.rooms} غرف</span>
                    <span className="rounded-full bg-surface-container px-3 py-1">قريب من {property.nearby_university}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to={`/properties/${property.id}`} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">عرض التفاصيل</Link>
                    <button onClick={() => handleRemove(property.id)} className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold text-on-surface-variant" type="button">
                      إزالة من المفضلة
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
