import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './monggoDb/Connect.js';
import postsRouter from './route/post/Post.js';
import getRouter from './route/get/Get.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://attendance-qr-checker-jdv6ksvq5-jek-s-projects.vercel.app/',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
  })
);

app.use(express.json({ limit: '10mb' }));

(async () => {
  try {
    console.log('Connecting to database...');
    await connectDb();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ DATABASE ERROR:', err);
    process.exit(1);
  }
})();

// Remove the /post and /get prefixes
app.use('/api', postsRouter);
app.use('/api', getRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
