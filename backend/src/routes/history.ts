import { Router, Response } from 'express';
import { History } from '../models/Reminder';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/history
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const history = await History.find({ userId: req.userId }).sort({ actionAt: -1 });
    return res.json({ success: true, data: history });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
