import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import HowItWorks from '../components/home/HowItWorks';
import SustainabilityStats from '../components/home/SustainabilityStats';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/productService';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [budgetProducts, setBudgetProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch 3 curated sets of products
        const [recentRes, budgetRes] = await Promise.all([
          productService.getProducts({ sort: 'newest', limit: 8 }),
          productService.getProducts({ maxPrice: 15000, limit: 4 }),
        ]);

        if (recentRes.success) {
          setRecentProducts(recentRes.products || []);
          // Use first 4 as featured
          setFeaturedProducts((recentRes.products || []).slice(0, 4));
        }

        if (budgetRes.success) {
          setBudgetProducts(budgetRes.products || []);
        }
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hero Section */}
      <HeroBanner />

      {/* Browse by Category */}
      <CategoryGrid />

      {/* Featured Products */}
      <section className="my-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Highlights
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Top condition items hand-picked by the community
              </p>
            </div>
          </div>
          <Link
            to="/browse"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Recently Listed Products */}
      <section className="my-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
              <Flame className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Fresh on the Loop
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Recently posted listings ready for direct pickup
              </p>
            </div>
          </div>
          <Link
            to="/browse?sort=newest"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>View All Fresh</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={recentProducts} loading={loading} />
      </section>

      {/* Budget Friendly Deals */}
      {budgetProducts.length > 0 && (
        <section className="my-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 shadow-sm">
                <Tag className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Budget Finds Under ₹15,000
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Great deals that won&apos;t break the bank
                </p>
              </div>
            </div>
            <Link
              to="/browse?maxPrice=15000"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
            >
              <span>Explore Budget</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={budgetProducts} loading={loading} />
        </section>
      )}

      {/* How ReLoop Works */}
      <HowItWorks />

      {/* Sustainability Impact Statistics */}
      <SustainabilityStats />
    </div>
  );
};

export default HomePage;
