import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Share2,
  Flag,
  MapPin,
  Calendar,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { productService } from '../services/productService';
import { chatService } from '../services/chatService';
import { formatPrice, timeAgo, formatJoinDate } from '../utils/helpers';
import ImageGallery from '../components/products/ImageGallery';
import ConditionBadge from '../components/common/ConditionBadge';
import FavoriteButton from '../components/common/FavoriteButton';
import SellerCard from '../components/products/SellerCard';
import ReportModal from '../components/common/ReportModal';
import ProductCard from '../components/products/ProductCard';
import { useAuth } from '../context/AuthContext';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [sellerStats, setSellerStats] = useState({ otherListingsCount: 0 });
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await productService.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          setSellerStats(res.sellerStats || { otherListingsCount: 0 });
          setSimilarProducts(res.similarProducts || []);
        } else {
          setError('Product listing not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'ReLoop Listing',
        text: `Check out this ${product?.title} on ReLoop!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await chatService.getOrCreateConversation(product._id);
      if (res.success && res.conversation) {
        navigate(`/chat?conversationId=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Failed to initiate conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
        <div className="h-6 bg-zinc-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-[4/3] bg-zinc-200 rounded-2xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-zinc-200 rounded w-3/4" />
            <div className="h-6 bg-zinc-200 rounded w-1/3" />
            <div className="h-24 bg-zinc-200 rounded-xl" />
            <div className="h-40 bg-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Listing Not Found</h2>
        <p className="text-xs text-zinc-600 mb-6">{error || 'This listing may have been removed or sold.'}</p>
        <Link to="/browse" className="btn-primary">
          Explore Other Listings
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === product.seller?._id;
  const isAvailable = product.status === 'active';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6 overflow-x-auto pb-1">
        <Link to="/" className="hover:text-brand-800 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link
          to={`/browse?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-800 transition-colors truncate"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-zinc-800 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          {/* Gallery */}
          <ImageGallery images={product.images} title={product.title} />

          {/* Description Section */}
          <div className="card-base p-6 sm:p-8 bg-white space-y-6">
            <h2 className="text-lg font-bold text-zinc-900">Description</h2>
            <div className="text-zinc-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal">
              {product.description}
            </div>

            {/* Specifications Grid */}
            <div className="pt-6 border-t border-surface-border">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4">
                Item Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-surface-subtle">
                  <span className="text-[10px] text-zinc-600 font-medium block">Category</span>
                  <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                    {product.category}
                  </span>
                </div>

                {product.brand && (
                  <div className="p-3 rounded-xl bg-surface-subtle">
                    <span className="text-[10px] text-zinc-600 font-medium block">Brand</span>
                    <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                      {product.brand}
                    </span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-surface-subtle">
                  <span className="text-[10px] text-zinc-600 font-medium block">Condition</span>
                  <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                    {product.condition}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle">
                  <span className="text-[10px] text-zinc-600 font-medium block">Location</span>
                  <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                    {product.location?.city}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle">
                  <span className="text-[10px] text-zinc-600 font-medium block">Listed</span>
                  <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                    {timeAgo(product.createdAt)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle">
                  <span className="text-[10px] text-zinc-600 font-medium block">Price Mode</span>
                  <span className="text-xs font-bold text-zinc-900 truncate block mt-0.5">
                    {product.negotiable ? 'Negotiable' : 'Fixed Price'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details, Actions & Seller Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Details Card */}
          <div className="card-base p-6 bg-white space-y-5">
            {/* Status & Condition row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <ConditionBadge condition={product.condition} size="sm" />

              {!isAvailable && (
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    product.status === 'sold'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {product.status === 'sold' ? 'Sold Out' : 'Reserved'}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.negotiable && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Negotiable
                </span>
              )}
            </div>

            {/* Location & Time metadata */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {product.location?.city}
                {product.location?.locality ? `, ${product.location.locality}` : ''}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                {product.views || 1} views
              </span>
            </div>

            {/* Actions: Chat & Favorite & Share */}
            <div className="pt-3 space-y-3">
              {!isOwner ? (
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={!isAvailable}
                  className="btn-primary w-full py-3.5 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isAvailable ? 'Chat with Seller' : 'Listing Unavailable'}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 text-center rounded-xl bg-brand-50 text-brand-900 text-xs font-semibold border border-brand-200">
                    You posted this listing
                  </div>
                  <Link
                    to={`/edit-listing/${product._id}`}
                    className="btn-secondary w-full text-xs text-center justify-center"
                  >
                    Edit Listing Details
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <FavoriteButton
                    product={product}
                    size="md"
                    className="w-full !rounded-xl !bg-surface-subtle !border-surface-border hover:!bg-zinc-200/60 py-2.5 gap-2"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="btn-secondary flex-1 text-xs py-2.5 gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Report Listing Trigger */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="text-[11px] text-zinc-600 hover:text-rose-600 inline-flex items-center gap-1 transition-colors"
              >
                <Flag className="w-3 h-3" />
                <span>Report this listing</span>
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <SellerCard
            seller={product.seller}
            productId={product._id}
            otherListingsCount={sellerStats.otherListingsCount}
          />
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-surface-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900">Similar Items in {product.category}</h3>
            <Link
              to={`/browse?category=${encodeURIComponent(product.category)}`}
              className="text-xs sm:text-sm font-semibold text-brand-800 hover:text-brand-900"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {similarProducts.map((sim) => (
              <ProductCard key={sim._id} product={sim} />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        productId={product._id}
        productTitle={product.title}
      />
    </div>
  );
};

export default ProductDetailPage;
