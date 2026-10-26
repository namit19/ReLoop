import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { formatPrice, timeAgo } from '../../utils/helpers';
import ConditionBadge from '../common/ConditionBadge';
import FavoriteButton from '../common/FavoriteButton';

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    _id,
    title,
    price,
    negotiable,
    condition,
    location,
    thumbnail,
    images,
    createdAt,
    status,
    category,
  } = product;

  const displayImage = thumbnail || (images && images[0]?.url) || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600';
  const isAvailable = status === 'active';

  return (
    <div className="card-base group overflow-hidden flex flex-col hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 relative bg-white">
      {/* Image Container */}
      <Link to={`/products/${_id}`} className="block relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton product={product} size="sm" />
        </div>

        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <ConditionBadge condition={condition} size="xs" />
        </div>

        {/* Status overlay if reserved or sold */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-zinc-900/90 border border-white/20">
              {status === 'sold' ? 'Sold Out' : 'Reserved'}
            </span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Price & Negotiable */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(price)}
            </span>
            {negotiable && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Negotiable
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/products/${_id}`} className="block group/title">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 group-hover/title:text-emerald-700 transition-colors leading-snug">
              {title}
            </h3>
          </Link>
        </div>

        {/* Meta details */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {location?.city}
              {location?.locality ? `, ${location.locality}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timeAgo(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
