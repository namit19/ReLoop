import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import FilterSidebar from '../components/products/FilterSidebar';
import MobileFilterDrawer from '../components/products/MobileFilterDrawer';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import { productService } from '../services/productService';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL search parameters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1,
  });

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Sync state when URL params change externally (e.g. search from Navbar)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      condition: searchParams.get('condition') || '',
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page'), 10) || 1,
    });
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts(filters);
      if (res.success) {
        setProducts(res.products || []);
        setTotalProducts(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch browse products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update a filter key and sync to URL
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);

    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'All') newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  // Reset all filters
  const handleResetFilters = () => {
    const reset = {
      search: '',
      category: '',
      condition: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1,
    };
    setFilters(reset);
    setSearchParams(new URLSearchParams());
  };

  // Change page
  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-surface-border gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {filters.category ? filters.category : 'Browse Marketplace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {loading ? (
              'Searching listings...'
            ) : (
              `Showing ${totalProducts} available ${totalProducts === 1 ? 'item' : 'items'} in India`
            )}
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden btn-secondary text-xs flex items-center gap-1.5 px-3 py-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-surface-border rounded-xl focus:outline-none focus:border-brand-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            totalResults={totalProducts}
          />
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle={filters.search ? `No items found matching "${filters.search}"` : 'No listings found'}
            emptyDescription="Try clearing filters or searching with broader keywords to discover more pre-loved items."
            onResetFilters={handleResetFilters}
          />

          {/* Pagination */}
          {!loading && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalProducts}
      />
    </div>
  );
};

export default BrowsePage;
