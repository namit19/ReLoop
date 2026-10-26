import mongoose from 'mongoose';
import dns from 'dns';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    if (uri.startsWith('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch (dnsErr) {
        // Fall back gracefully if custom DNS setting is restricted
      }
    }
    try {
      const conn = await mongoose.connect(uri);
      console.log(` MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`⚠️ Warning: Could not connect to configured MONGODB_URI: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('🔄 Falling back to in-memory MongoDB for local development/testing...');
    }
  }

  // Fallback to MongoMemoryServer for effortless local development and tests
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(` MongoDB Connected to in-memory instance: ${memoryUri}`);
    return conn;
  } catch (err) {
    console.error(`❌ Failed to start in-memory MongoDB: ${err.message}`);
    throw err;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
