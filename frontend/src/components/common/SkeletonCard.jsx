import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="card-base overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-[4/3] bg-zinc-200" />
      {/* Body skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-zinc-200 rounded-md w-1/3" />
          <div className="h-4 bg-zinc-200 rounded-md w-1/4" />
        </div>
        <div className="h-4 bg-zinc-200 rounded-md w-4/5" />
        <div className="h-3 bg-zinc-200 rounded-md w-2/5" />
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div className="h-3 bg-zinc-200 rounded-md w-1/4" />
          <div className="h-3 bg-zinc-200 rounded-md w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonCard;
