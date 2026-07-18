import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with support for frontend local servers
app.use(cors({
  origin: '*', // Allow all origins for now until frontend is deployed
  credentials: true,
}));

app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StudyStay API is running smoothly' });
});

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[Server] StudyStay Backend running on port ${PORT}`);
  });
}

export default app;
