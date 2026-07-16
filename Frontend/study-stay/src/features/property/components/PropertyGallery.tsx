import React, { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const gallery = images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const goTo = (index: number) => {
    setActiveIndex(((index % gallery.length) + gallery.length) % gallery.length);
  };

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={gallery[activeIndex]}
          alt={`${title} ${activeIndex + 1}`}
          onClick={() => setFullscreen(true)}
          className="w-full h-80 object-cover cursor-zoom-in"
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute top-1/2 -translate-y-1/2 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="السابق"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute top-1/2 -translate-y-1/2 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="التالي"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
              {activeIndex + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-7 gap-2">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={image} alt={`مصغرة ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
            className="absolute top-1/2 -translate-y-1/2 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
          <img
            src={gallery[activeIndex]}
            alt={`${title} ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
            className="absolute top-1/2 -translate-y-1/2 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
