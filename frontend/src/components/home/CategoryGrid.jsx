import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../utils/categories';

export const CategoryGrid = () => {
  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Explore thousands of pre-loved goods in verified categories
          </p>
        </div>
        <Link
          to="/browse"
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/browse?category=${encodeURIComponent(cat.slug)}`}
              className="card-base p-4 flex flex-col items-center text-center group hover:border-emerald-300 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm ${cat.badgeColor}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight mb-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
