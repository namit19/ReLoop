import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageSearch,
  title = 'No items found',
  description = 'Try adjusting your search criteria, clear active filters, or check back later.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="card-base p-10 md:p-14 text-center max-w-lg mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-800 mb-4 shadow-soft-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-2">{title}</h3>
      <p className="text-zinc-600 text-sm mb-6 leading-relaxed max-w-md">{description}</p>
      {actionLink && actionText && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
      {onAction && actionText && !actionLink && (
        <button type="button" onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
