import { Router, Request, Response } from 'express';

const router = Router();

// Static category data (also used by Fetch API in Exp 7)
const CATEGORIES = [
  { id: 'c1', name: 'Diabetes',       icon: '💊', color: '#4A90E2' },
  { id: 'c2', name: 'Blood Pressure', icon: '❤️', color: '#E74C3C' },
  { id: 'c3', name: 'Vitamins',       icon: '🌟', color: '#F39C12' },
  { id: 'c4', name: 'Cholesterol',    icon: '🫀', color: '#9B59B6' },
  { id: 'c5', name: 'Heart',          icon: '💓', color: '#E91E63' },
  { id: 'c6', name: 'Antibiotics',    icon: '🧬', color: '#2ECC71' },
  { id: 'c7', name: 'Pain Relief',    icon: '💆', color: '#FF6B6B' },
  { id: 'c8', name: 'Gastrointestinal', icon: '🫁', color: '#45B7D1' },
];

// GET /api/categories
router.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, data: CATEGORIES });
});

export default router;
