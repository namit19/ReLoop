import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, timeAgo } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const ChatWindow = ({
  conversation,
  messages = [],
  onSendMessage,
  loading = false,
}) => {
  const { user } = useAuth();
  const { isConnected, isUserOnline } = useSocket();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const textToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await onSendMessage(textToSend);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400">
        <p className="text-sm font-medium">Select a conversation to start messaging</p>
      </div>
    );
  }

  const otherUser = conversation.otherUser || {};
  const product = conversation.product || {};
  const isOnline = isUserOnline(otherUser._id);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-surface-border flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover border border-surface-border"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-zinc-900">{otherUser.name}</h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              {isOnline ? (
                <span className="text-emerald-700 font-semibold">Online now</span>
              ) : (
                <span>Active recently</span>
              )}
              {otherUser.city && <span>• {otherUser.city}</span>}
            </p>
          </div>
        </div>

        {/* Safety reminder indicator */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Keep chats on ReLoop</span>
        </div>
      </div>

      {/* Disconnect Fallback Banner if Socket is disconnected */}
      {!isConnected && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-center gap-2 text-[11px] text-amber-800 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Real-time connection paused. Messages sync via standard API.</span>
        </div>
      )}

      {/* Product Mini Preview Header */}
      {product._id && (
        <div className="p-2.5 sm:p-3 bg-surface-subtle/70 border-b border-surface-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.thumbnail || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=100'}
              alt={product.title}
              className="w-10 h-10 rounded-lg object-cover border border-surface-border flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">{product.title}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-extrabold text-brand-900">{formatPrice(product.price)}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                  {product.status}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/products/${product._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-brand-800 hover:text-brand-900 px-2.5 py-1.5 rounded-lg hover:bg-white transition-colors flex-shrink-0"
          >
            <span>View</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-bg/50">
        {loading ? (
          <div className="space-y-3 py-4">
            <div className="w-1/2 h-10 bg-zinc-200 rounded-2xl animate-pulse" />
            <div className="w-1/2 h-10 bg-zinc-200 rounded-2xl animate-pulse ml-auto" />
            <div className="w-2/3 h-10 bg-zinc-200 rounded-2xl animate-pulse" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-400">
            No messages yet. Say hello and make an offer!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id?.toString() === user?._id?.toString() || msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-soft-sm ${
                    isMe
                      ? 'bg-brand-800 text-white rounded-br-sm'
                      : 'bg-white text-zinc-900 border border-surface-border rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400 px-1">
                  <span>{timeAgo(msg.createdAt)}</span>
                  {isMe && msg.read && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Field */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-surface-border bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${otherUser.name || 'seller'}...`}
          className="input-field text-xs sm:text-sm py-2.5 flex-1"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="btn-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
