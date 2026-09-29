import { Router, Response } from 'express';
import Medicine from '../models/Medicine';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/medicines
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { q, category, isActive } = req.query;
    const filter: any = { userId: req.userId };
    if (q)        filter.name     = { $regex: q as string, $options: 'i' };
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: medicines });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/medicines/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.findOne({ _id: req.params.id, userId: req.userId });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found.' });
    return res.json({ success: true, data: medicine });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/medicines
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, dosage, frequency, reminderTime, notes, category } = req.body;
    if (!name || !dosage || !frequency || !reminderTime) {
      return res.status(400).json({ success: false, message: 'name, dosage, frequency, reminderTime are required.' });
    }
    const medicine = await Medicine.create({ userId: req.userId, name, dosage, frequency, reminderTime, notes, category });
    return res.status(201).json({ success: true, message: 'Medicine created.', data: medicine });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/medicines/:id
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, dosage, frequency, reminderTime, notes, isActive, category } = req.body;
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, dosage, frequency, reminderTime, notes, isActive, category },
      { new: true, runValidators: true },
    );
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found.' });
    return res.json({ success: true, message: 'Medicine updated.', data: medicine });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/medicines/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found.' });
    return res.json({ success: true, message: 'Medicine deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
