import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

export const FavoriteButton = ({ product, size = 'md', className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  const productId = product?._id || product;
  const favorited = isFavorite(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    const result = await toggleFavorite(product);
    if (result?.requireAuth) {
      navigate('/login');
    }
  };

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`rounded-full flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm border border-zinc-200/60 shadow-soft-sm hover:scale-105 active:scale-95 ${
        sizeMap[size] || sizeMap.md
      } ${animating ? 'scale-125' : ''} ${className}`}
    >
      <Heart
        className={`${iconMap[size] || iconMap.md} transition-colors ${
          favorited
            ? 'fill-rose-500 text-rose-500'
            : 'text-zinc-600 hover:text-rose-500'
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
