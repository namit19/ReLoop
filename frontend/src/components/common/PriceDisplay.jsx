import React from 'react';
import { formatPrice } from '../../utils/helpers';

export const PriceDisplay = ({ price, negotiable, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl sm:text-3xl font-extrabold',
  };

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`text-zinc-900 tracking-tight ${sizeClasses[size] || sizeClasses.md}`}>
        {formatPrice(price)}
      </span>
      {negotiable && (
        <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Negotiable
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
