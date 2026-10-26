import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center mb-6 shadow-soft-sm">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-zinc-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mb-8 leading-relaxed">
        The listing, page, or profile you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/" className="btn-primary text-xs flex items-center gap-1.5">
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link to="/browse" className="btn-secondary text-xs">
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
