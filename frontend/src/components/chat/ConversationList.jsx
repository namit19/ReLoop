import React from 'react';
import { formatPrice, timeAgo } from '../../utils/helpers';
import { useSocket } from '../../context/SocketContext';

export const ConversationList = ({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  loading = false,
}) => {
  const { isUserOnline } = useSocket();

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 animate-pulse p-3 rounded-xl bg-zinc-50">
            <div className="w-12 h-12 rounded-full bg-zinc-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 rounded w-1/2" />
              <div className="h-3 bg-zinc-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-zinc-500">
        No active conversations yet. Start a chat by clicking &quot;Contact Seller&quot; on any product!
      </div>
    );
  }

  return (
    <div className="divide-y divide-surface-border">
      {conversations.map((conv) => {
        const isActive = activeConversationId === conv._id;
        const otherUser = conv.otherUser || {};
        const product = conv.product || {};
        const isOnline = isUserOnline(otherUser._id);

        return (
          <button
            key={conv._id}
            type="button"
            onClick={() => onSelectConversation(conv._id)}
            className={`w-full p-3.5 sm:p-4 text-left flex items-start gap-3 transition-colors ${
              isActive ? 'bg-brand-50/80 border-l-4 border-brand-800' : 'hover:bg-surface-subtle'
            }`}
          >
            {/* User Avatar with Online Indicator */}
            <div className="relative flex-shrink-0">
              <img
                src={otherUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={otherUser.name || 'User'}
                className="w-11 h-11 rounded-full object-cover border border-surface-border"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            {/* Content Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-xs font-bold text-zinc-900 truncate">
                  {otherUser.name || 'User'}
                </span>
                <span className="text-[10px] text-zinc-400 flex-shrink-0">
                  {timeAgo(conv.lastMessageAt || conv.updatedAt)}
                </span>
              </div>

              {/* Product mini title */}
              {product.title && (
                <p className="text-[11px] font-semibold text-brand-900 truncate">
                  {product.title} • {formatPrice(product.price)}
                </p>
              )}

              {/* Last message text */}
              <p className="text-xs text-zinc-500 truncate mt-0.5">
                {conv.lastMessage || 'New conversation'}
              </p>
            </div>

            {/* Product Thumbnail Mini */}
            {product.thumbnail && (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-9 h-9 rounded-lg object-cover border border-surface-border flex-shrink-0"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
