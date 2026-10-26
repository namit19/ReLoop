import React, { useRef, useState } from 'react';
import { UploadCloud, X, Star, AlertCircle } from 'lucide-react';

export const ImageUploader = ({
  images = [],
  onChange,
  coverIndex = 0,
  onSelectCover,
  maxImages = 8,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (files) => {
    setError('');
    const validFiles = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images in total.`);
      return;
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are supported.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }

      // Create preview object
      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        id: Math.random().toString(36).substring(2, 9),
      });
    }

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
    if (coverIndex === index) {
      onSelectCover(0);
    } else if (coverIndex > index) {
      onSelectCover(coverIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-brand-700 bg-brand-50/60 scale-[1.01]'
            : 'border-surface-border bg-surface-subtle/50 hover:bg-surface-subtle hover:border-zinc-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(Array.from(e.target.files));
          }}
        />

        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center mx-auto mb-3 shadow-soft-sm">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-zinc-900 mb-1">
          Click to upload or drag & drop product photos
        </p>
        <p className="text-xs text-zinc-500">
          Upload up to {maxImages} images (JPEG, PNG, WebP up to 5MB each). First image is cover.
        </p>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Previews */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Photos ({images.length}/{maxImages})
            </span>
            <span className="text-[11px] text-zinc-500">
              Click ⭐ on an image to set it as cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const src = img.preview || img.url;
              const isCover = coverIndex === idx;

              return (
                <div
                  key={img.id || idx}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 group bg-zinc-100 transition-all ${
                    isCover
                      ? 'border-brand-700 ring-2 ring-brand-700/20 shadow-soft-sm'
                      : 'border-surface-border'
                  }`}
                >
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />

                  {/* Cover badge */}
                  {isCover && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-800 text-white text-[10px] font-bold shadow-soft-sm">
                      Cover
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCover(idx);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 text-amber-600 hover:bg-white shadow-soft-sm"
                        title="Set as Cover"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white shadow-soft-sm"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
