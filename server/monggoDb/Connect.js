import mongoose from 'mongoose';

export async function connectDb() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected successfully');
    console.log(MONGODB_URI);

    return mongoose;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export function disconnectDb() {
  return mongoose.disconnect();
}
