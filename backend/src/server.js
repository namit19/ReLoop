import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/chatSocket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const server = http.createServer(app);

// Initialize real-time Socket.IO
initSocket(server, CLIENT_URL);

// Connect to Database & start listening
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 ReLoop Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export { server };
