import React from 'react';
import ProductCard from './ProductCard';
import { SkeletonGrid } from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  onResetFilters,
}) => {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No listings found'}
        description={emptyDescription || 'Try searching for something else or clearing filters to see more listings.'}
        actionText={onResetFilters ? 'Clear All Filters' : 'Explore All Listings'}
        actionLink={!onResetFilters ? '/browse' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
