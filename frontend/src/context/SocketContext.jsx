import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const socketInstance = io(socketUrl, {
        query: {
          userId: user._id,
        },
        transports: ['websocket', 'polling'],
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
      });

      socketInstance.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]);

  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.includes(userId.toString());
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        isConnected,
        isUserOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
