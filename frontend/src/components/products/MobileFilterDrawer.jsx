import React from 'react';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in">
      <div className="w-full max-w-xs h-full bg-white shadow-soft-xl flex flex-col animate-slide-left">
        {/* Drawer header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <span className="font-bold text-sm text-zinc-900">Filter Products</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            totalResults={totalResults}
          />
        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary w-full text-xs"
          >
            Show {totalResults !== undefined ? `${totalResults} Listings` : 'Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
