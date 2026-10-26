import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { CATEGORIES, CONDITIONS, CITIES } from '../../utils/categories';

export const FilterSidebar = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const handleCategoryChange = (slug) => {
    onChange('category', filters.category === slug ? '' : slug);
  };

  const handleConditionChange = (val) => {
    onChange('condition', filters.condition === val ? '' : val);
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.condition ||
    filters.city ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search
  );

  return (
    <aside className="w-full bg-white card-base p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleCategoryChange('')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !filters.category ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filters.category === cat.slug
                  ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-surface-border">
        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-zinc-500 font-medium block mb-1">Min Price</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onChange('minPrice', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:border-brand-700"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 font-medium block mb-1">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange('maxPrice', e.target.value)}
              placeholder="Max"
              min="0"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:border-brand-700"
            />
          </div>
        </div>
      </div>

      {/* Condition Filter */}
      <div className="pt-4 border-t border-surface-border">
        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">
          Item Condition
        </h4>
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => (
            <label
              key={cond.value}
              className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700 hover:text-zinc-900"
            >
              <input
                type="radio"
                name="condition"
                checked={filters.condition === cond.value || (!filters.condition && cond.value === 'All')}
                onChange={() => handleConditionChange(cond.value === 'All' ? '' : cond.value)}
                className="text-brand-800 focus:ring-brand-700 rounded"
              />
              <span>{cond.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City / Location Filter */}
      <div className="pt-4 border-t border-surface-border">
        <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2.5">
          Location
        </h4>
        <select
          value={filters.city || 'All'}
          onChange={(e) => onChange('city', e.target.value === 'All' ? '' : e.target.value)}
          className="input-field text-xs py-2"
        >
          {CITIES.map((city) => (
            <option key={city} value={city === 'All Cities' ? 'All' : city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-surface-border">
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-brand-50 text-brand-900 border border-brand-200">
                {filters.category}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-600"
                  onClick={() => onChange('category', '')}
                />
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-brand-50 text-brand-900 border border-brand-200">
                {filters.condition}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-600"
                  onClick={() => onChange('condition', '')}
                />
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-brand-50 text-brand-900 border border-brand-200">
                {filters.city}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-600"
                  onClick={() => onChange('city', '')}
                />
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-brand-50 text-brand-900 border border-brand-200">
                ₹{filters.minPrice || 0} - ₹{filters.maxPrice || '∞'}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-600"
                  onClick={() => {
                    onChange('minPrice', '');
                    onChange('maxPrice', '');
                  }}
                />
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
