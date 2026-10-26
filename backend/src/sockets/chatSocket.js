import { Server } from 'socket.io';

export let io = null;
const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
      userSocketMap[userId] = socket.id;
      console.log(`🔌 User connected: ${userId} (Socket: ${socket.id})`);
    }

    // Broadcast online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle join room for a specific conversation
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    // Handle typing events
    socket.on('typing', ({ conversationId, senderId }) => {
      socket.to(conversationId).emit('userTyping', { conversationId, senderId });
    });

    socket.on('stopTyping', ({ conversationId, senderId }) => {
      socket.to(conversationId).emit('userStopTyping', { conversationId, senderId });
    });

    socket.on('disconnect', () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`❌ User disconnected: ${userId}`);
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
    });
  });

  return io;
};
