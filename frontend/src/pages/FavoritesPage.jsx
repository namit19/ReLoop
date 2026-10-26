import React from 'react';
import { Heart, ArrowLeft, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import ProductGrid from '../components/products/ProductGrid';

export const FavoritesPage = () => {
  const { favoriteProducts, favoritesCount, loading } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Wishlist & Saved</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Saved Products ({favoritesCount})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Keep track of items you love and watch for price updates
          </p>
        </div>

        <Link
          to="/browse"
          className="btn-secondary text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing</span>
        </Link>
      </div>

      {/* Grid of Favorited Products */}
      <ProductGrid
        products={favoriteProducts}
        loading={loading}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Browse the marketplace and click the heart icon on any item to save it here for later."
      />
    </div>
  );
};

export default FavoritesPage;
