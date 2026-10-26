import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, ShieldCheck, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { formatJoinDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';

export const SellerCard = ({
  seller,
  productId,
  otherListingsCount = 0,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!seller) return null;

  const isOwnListing = user && user._id === seller._id;

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isOwnListing) return;

    try {
      const res = await chatService.getOrCreateConversation(productId);
      if (res.success && res.conversation) {
        navigate(`/chat?conversationId=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className="card-base p-6 bg-white space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
          Seller Information
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Seller
        </span>
      </div>

      <div className="flex items-center gap-3.5">
        <img
          src={seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={seller.name}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100 shadow-soft-sm flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <Link
            to={`/users/${seller._id}`}
            className="text-base font-bold text-zinc-900 hover:text-brand-800 transition-colors truncate block"
          >
            {seller.name}
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {seller.city}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Member since {formatJoinDate(seller.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {otherListingsCount > 0 && (
        <div className="p-3 rounded-xl bg-surface-subtle text-xs text-zinc-600 flex items-center justify-between">
          <span>Other active items for sale</span>
          <span className="font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-surface-border">
            {otherListingsCount}
          </span>
        </div>
      )}

      {/* Chat Action */}
      {!isOwnListing ? (
        <button
          type="button"
          onClick={handleStartChat}
          className="btn-primary w-full text-sm py-3 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with Seller</span>
        </button>
      ) : (
        <div className="p-3 text-center rounded-xl bg-brand-50 text-brand-900 text-xs font-semibold border border-brand-200">
          This is your listing
        </div>
      )}
    </div>
  );
};

export default SellerCard;
