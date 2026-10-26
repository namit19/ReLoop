import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Search } from 'lucide-react';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { chatService } from '../services/chatService';
import { useSocket } from '../context/SocketContext';

export const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConversationId = searchParams.get('conversationId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const { socket } = useSocket();

  // Load conversations list
  const loadConversations = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await chatService.getConversations();
      if (res.success) {
        setConversations(res.conversations || []);

        // If no conversation in URL, select the first one if available
        if (!activeConversationId && res.conversations?.length > 0) {
          setSearchParams({ conversationId: res.conversations[0]._id });
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingList(false);
    }
  }, [activeConversationId, setSearchParams]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load active conversation & its messages
  useEffect(() => {
    if (!activeConversationId) {
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await chatService.getMessages(activeConversationId);
        if (res.success) {
          setActiveConversation(res.conversation);
          setMessages(res.messages || []);
        }
      } catch (err) {
        console.error('Failed to load messages for conversation:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    // Join room on Socket.IO
    if (socket) {
      socket.emit('joinConversation', activeConversationId);
    }
  }, [activeConversationId, socket]);

  // Listen for real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // If message is for the currently open conversation, append to list
      if (newMessage.conversation === activeConversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // Update conversation in list with lastMessage
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv._id === newMessage.conversation) {
            return {
              ...conv,
              lastMessage: newMessage.text,
              lastMessageAt: newMessage.createdAt,
            };
          }
          return conv;
        })
      );
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, activeConversationId]);

  const handleSelectConversation = (id) => {
    setSearchParams({ conversationId: id });
  };

  const handleSendMessage = async (text) => {
    if (!activeConversationId) return;

    const res = await chatService.sendMessage(activeConversationId, text);
    if (res.success && res.message) {
      setMessages((prev) => [...prev, res.message]);

      // Update conversation lastMessage
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversationId
            ? { ...c, lastMessage: text, lastMessageAt: new Date() }
            : c
        )
      );
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.otherUser?.name?.toLowerCase() || '';
    const title = c.product?.title?.toLowerCase() || '';
    const q = searchFilter.toLowerCase();
    return name.includes(q) || title.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
          Buyer & Seller Messages
        </h1>
        <p className="text-xs text-zinc-500">
          Negotiate deals and arrange safe meetups in real-time
        </p>
      </div>

      {/* Chat Container */}
      <div className="card-base bg-white overflow-hidden shadow-soft-lg h-[75vh] flex">
        {/* Left Pane: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-surface-border flex flex-col ${
            activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search conversations */}
          <div className="p-3 border-b border-surface-border">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..."
                className="input-field pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              loading={loadingList}
            />
          </div>
        </div>

        {/* Right Pane: Active Chat Window */}
        <div
          className={`flex-1 flex flex-col ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversationId && (
            <div className="md:hidden p-2 border-b border-surface-border bg-white flex items-center">
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="btn-secondary text-xs p-1.5 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Chats</span>
              </button>
            </div>
          )}

          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loadingMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
