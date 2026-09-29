import { Router, Response } from 'express';
import Reminder from '../models/Reminder';
import { History } from '../models/Reminder';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/reminders
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status, date } = req.query;
    const filter: any = { userId: req.userId };
    if (status) filter.status = status;
    if (date)   filter.date   = date;
    const reminders = await Reminder.find(filter).sort({ date: -1, scheduledTime: 1 });
    return res.json({ success: true, data: reminders });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reminders
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { medicineId, medicineName, dosage, scheduledTime, date } = req.body;
    if (!medicineId || !medicineName || !dosage || !scheduledTime || !date) {
      return res.status(400).json({ success: false, message: 'All reminder fields are required.' });
    }
    const reminder = await Reminder.create({
      userId: req.userId, medicineId, medicineName, dosage, scheduledTime, date,
    });
    return res.status(201).json({ success: true, data: reminder });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/reminders/:id/status
router.patch('/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!['Taken', 'Missed', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const update: any = { status };
    if (status === 'Taken') update.takenAt = new Date().toTimeString().slice(0, 5);

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true },
    );
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found.' });

    // Save to history
    if (status !== 'Pending') {
      const medicine = await import('../models/Medicine').then(m => m.default.findById(reminder.medicineId));
      if (medicine) {
        await History.create({
          userId:     req.userId,
          reminderId: reminder._id,
          medicineDetails: {
            name:         medicine.name,
            dosage:       medicine.dosage,
            frequency:    medicine.frequency,
            reminderTime: medicine.reminderTime,
          },
          status,
        });
      }
    }

    return res.json({ success: true, message: `Reminder marked as ${status}`, data: reminder });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reminders/:id
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found.' });
    return res.json({ success: true, message: 'Reminder deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
