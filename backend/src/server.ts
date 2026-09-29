/**
 * Smart Medicine Reminder — Express.js Server
 * Experiments 9, 10, 11, 12
 */
import express, { Request, Response, NextFunction } from 'express';
import cors    from 'cors';
import morgan  from 'morgan';
import dotenv  from 'dotenv';
import mongoose from 'mongoose';

// Routes
import userRoutes     from './routes/users';
import medicineRoutes from './routes/medicines';
import reminderRoutes from './routes/reminders';
import historyRoutes  from './routes/history';
import categoryRoutes from './routes/categories';

dotenv.config();

const app    = express();
const PORT   = process.env.PORT ?? 5000;
const MONGO  = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mediremind';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));   // Request logger

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: '🩺 MediRemind API is running',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/medicines',
      '/api/reminders',
      '/api/history',
      '/api/categories',
    ],
  });
});

app.use('/api/users',      userRoutes);
app.use('/api/medicines',  medicineRoutes);
app.use('/api/reminders',  reminderRoutes);
app.use('/api/history',    historyRoutes);
app.use('/api/categories', categoryRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ success: false, message: err.message ?? 'Internal server error' });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
mongoose
  .connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected:', MONGO);
    app.listen(PORT, () => {
      console.log(`🚀 MediRemind server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    // Run without DB (Experiment 9 — in-memory mode)
    app.listen(PORT, () => {
      console.log(`⚠️  Server running WITHOUT MongoDB on http://localhost:${PORT}`);
    });
  });

export default app;
