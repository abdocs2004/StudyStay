import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../property/property.service';
import { resolveImageUrl } from '../../../utils/imageUrl';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: number, currentlyFavorite: boolean) => Promise<void> | void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isFavorite: isFavoriteProp = false, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);
  const imageSrc = resolveImageUrl(property.main_image || property.image) || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80';

  useEffect(() => {
    setIsFavorite(isFavoriteProp);
  }, [isFavoriteProp]);

  const handleFavoriteClick = async () => {
    setIsFavorite((current) => !current);
    if (onToggleFavorite) {
      await onToggleFavorite(property.id, isFavorite);
    }
  };

  return (
    <article className="group rounded-[1.75rem] overflow-hidden bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.04)] border border-slate-100/80 hover:border-indigo-100 hover:shadow-[0_20px_40px_rgba(20,27,43,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56">
        <img src={imageSrc} alt={property.title} className="h-full w-full object-cover" />
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="rounded-full bg-white/90 p-2 text-rose-600 shadow-sm hover:bg-white"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="material-symbols-outlined">{isFavorite ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs font-bold">
          <span className="rounded-full bg-white/95 px-3 py-1 text-indigo-700 shadow-xs uppercase tracking-wide">{property.type}</span>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-white shadow-xs">{property.occupancy || 'متاح'}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-headline text-lg font-bold text-slate-900 line-clamp-2">{property.title}</h3>
            <p className="text-xs text-on-surface-variant mt-2">{property.city} | {property.nearby_university}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-primary">{Number(property.rent).toLocaleString('en-US')} ج.م</p>
            <p className="text-[10px] text-on-surface-variant">شهريًا</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
          <span className="rounded-full bg-surface-container px-3 py-2">{property.rooms} غرف</span>
          <span className="rounded-full bg-surface-container px-3 py-2">{property.bathrooms} حمام</span>
          <span className="rounded-full bg-surface-container px-3 py-2">{property.size} م²</span>
          <span className="rounded-full bg-surface-container px-3 py-2">{property.address}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          <Link
            to={`/properties/${property.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            عرض التفاصيل
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
          <Link
            to={`/messages?userId=${property.owner_id}&propertyId=${property.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary transition-colors"
          >
            تواصل مع المالك
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
