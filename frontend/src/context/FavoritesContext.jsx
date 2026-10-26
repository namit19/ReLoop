import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setFavoriteProducts([]);
      return;
    }
    try {
      setLoading(true);
      const res = await userService.getMyFavorites();
      if (res.success && Array.isArray(res.favorites)) {
        setFavoriteProducts(res.favorites);
        setFavoriteIds(new Set(res.favorites.map((p) => (p._id ? p._id.toString() : p.toString()))));
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (productId) => {
    if (!productId) return false;
    return favoriteIds.has(productId.toString());
  };

  const toggleFavorite = async (product) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    const productId = product._id ? product._id.toString() : product.toString();
    const currentlyFav = favoriteIds.has(productId);

    // Optimistic UI update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (currentlyFav) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    if (currentlyFav) {
      setFavoriteProducts((prev) => prev.filter((p) => (p._id || p).toString() !== productId));
    } else if (typeof product === 'object') {
      setFavoriteProducts((prev) => [product, ...prev]);
    }

    try {
      if (currentlyFav) {
        await userService.removeFavorite(productId);
      } else {
        await userService.addFavorite(productId);
      }
      return { success: true, isFavorited: !currentlyFav };
    } catch (err) {
      // Revert optimistic update on error
      fetchFavorites();
      throw err;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteProducts,
        favoritesCount: favoriteIds.size,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites: fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
