import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Validate env at call time to avoid crashing during build/import
  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your environment (.env.local / Vercel env vars)');
  }
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      family: 4, // force IPv4 to avoid some DNS/IPv6 issues with Atlas
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default connectDB;
