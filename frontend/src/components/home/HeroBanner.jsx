import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, PlusCircle, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../utils/categories';

export const HeroBanner = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category) params.set('category', category);
    navigate(`/browse?${params.toString()}`);
  };

  const popularTags = ['iPhone', 'MacBook', 'Sofa', 'Triban Bike', 'Fujifilm', 'Biker Jacket'];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#062c21] to-[#043d2e] text-white my-4 sm:my-6 shadow-2xl border border-emerald-500/20">
      {/* Decorative background grid and vibrant aurora glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-emerald-500/25 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-14 sm:py-24 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold mb-6 shadow-soft-sm tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>India&apos;s Modern Second-Life Marketplace</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          Good things deserve <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent underline decoration-emerald-400/50 decoration-wavy decoration-2">
            a second life.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Buy quality pre-loved electronics, furniture, books, and vehicles directly from verified locals. Save up to 70% while keeping great products out of landfills.
        </p>

        {/* Search & Category Filter Box */}
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 border border-white/40 focus-within:ring-4 focus-within:ring-emerald-500/25 transition-all"
        >
          {/* Category Dropdown */}
          <div className="w-full sm:w-44 flex-shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 sm:bg-transparent rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block w-[1px] h-7 bg-slate-200" />

          {/* Search Input */}
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you searching for today?"
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Popular searches & Sell CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-emerald-200/80">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => navigate(`/browse?search=${encodeURIComponent(tag)}`)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white transition-all text-[11px] font-medium backdrop-blur-sm border border-white/10"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Your Item</span>
          </Link>
          <Link
            to="/browse"
            className="text-xs sm:text-sm font-semibold text-slate-200 hover:text-emerald-300 transition-colors flex items-center gap-1.5 px-3 py-2"
          >
            <span>Browse All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
