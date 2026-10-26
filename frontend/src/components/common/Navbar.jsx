import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  MapPin,
  PlusCircle,
  Heart,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Package,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { CITIES, CATEGORIES } from '../../utils/categories';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cityRef = useRef(null);
  const profileRef = useRef(null);
  const categoryRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setIsCategoryOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All Cities') params.set('city', selectedCity);
    navigate(`/browse?${params.toString()}`);
    setIsMobileMenuOpen(false);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsCityOpen(false);
    const params = new URLSearchParams(location.search);
    if (city === 'All Cities') {
      params.delete('city');
    } else {
      params.set('city', city);
    }
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:shadow-emerald-600/40 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 transition-transform group-hover:rotate-45"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  Re<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Loop</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hidden sm:block">
                  Second-Life Marketplace
                </span>
              </div>
            </Link>

            {/* Location selector (Desktop) */}
            <div className="relative hidden lg:block" ref={cityRef}>
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-surface-subtle hover:bg-slate-200/70 border border-surface-border transition-all"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="truncate max-w-[100px]">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-surface-border rounded-xl shadow-soft-lg py-1.5 z-50">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-surface-subtle transition-colors ${
                        selectedCity === city ? 'text-brand-800 bg-brand-50/60 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Bar (Desktop/Tablet) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl items-center relative"
            >
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find phones, laptops, sofas, bikes, and more..."
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-surface-subtle border border-surface-border text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-600 shadow-sm transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Nav Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Categories Shortcut */}
              <div className="relative hidden xl:block" ref={categoryRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-brand-800 rounded-xl hover:bg-surface-subtle transition-all"
                >
                  <Layers className="w-4 h-4 text-zinc-600" />
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-surface-border rounded-2xl shadow-soft-xl p-3 z-50 grid grid-cols-1 gap-1">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          to={`/browse?category=${encodeURIComponent(cat.slug)}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-subtle text-xs text-zinc-700 hover:text-brand-900 transition-colors"
                        >
                          <div className={`p-1.5 rounded-lg border ${cat.badgeColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Favorites icon */}
              <Link
                to="/favorites"
                className="relative p-2.5 rounded-xl text-zinc-600 hover:text-brand-800 hover:bg-surface-subtle transition-all"
                aria-label="Favorites"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-scale-up">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>

              {/* Chat icon */}
              <Link
                to="/chat"
                className="relative p-2.5 rounded-xl text-zinc-600 hover:text-brand-800 hover:bg-surface-subtle transition-all"
                aria-label="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>

              {/* Sell CTA button */}
              <Link
                to="/create-listing"
                className="btn-primary text-xs sm:text-sm px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span className="font-bold">Sell Item</span>
              </Link>

              {/* Profile or Login */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-surface-subtle border border-surface-border transition-all"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user?.name || 'User'}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-brand-200"
                    />
                    <span className="text-xs font-semibold text-zinc-800 hidden sm:block max-w-[80px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-border rounded-2xl shadow-soft-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-surface-border">
                        <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-zinc-600 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-surface-subtle transition-colors"
                      >
                        <User className="w-4 h-4 text-zinc-600" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/profile?tab=listings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-surface-subtle transition-colors"
                      >
                        <Package className="w-4 h-4 text-zinc-600" />
                        <span>My Listings</span>
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-surface-subtle transition-colors"
                      >
                        <Heart className="w-4 h-4 text-zinc-600" />
                        <span>Favorites</span>
                      </Link>

                      <div className="border-t border-surface-border my-1" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-zinc-700 hover:text-brand-800 px-3 py-2 rounded-xl hover:bg-surface-subtle transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-secondary text-xs px-3 py-2 rounded-xl hidden sm:inline-flex"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-surface-subtle"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search & Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-surface-border space-y-3 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products in ReLoop..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-subtle border border-surface-border text-xs"
                />
              </form>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="w-full text-xs font-semibold bg-surface-subtle border border-surface-border rounded-xl px-3 py-2"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/browse"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-secondary text-xs text-center justify-center"
                >
                  Browse All
                </Link>
                <Link
                  to="/create-listing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary text-xs text-center justify-center"
                >
                  + Sell Product
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
