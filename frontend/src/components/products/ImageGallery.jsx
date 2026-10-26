import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export const ImageGallery = ({ images = [], title = 'Product Image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imageList = images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800' }];
  const currentImg = imageList[currentIndex]?.url || imageList[0]?.url;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Large Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-surface-border group">
        <img
          src={currentImg}
          alt={`${title} - view ${currentIndex + 1}`}
          className="w-full h-full object-contain cursor-zoom-in bg-zinc-950/5 transition-transform duration-300"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Zoom Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 backdrop-blur-sm text-zinc-700 hover:bg-white shadow-soft-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm shadow-soft-md text-zinc-800 flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm shadow-soft-md text-zinc-800 flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {imageList.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
            {currentIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnails row */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-brand-800 ring-2 ring-brand-800/20 shadow-soft-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={currentImg}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {imageList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
