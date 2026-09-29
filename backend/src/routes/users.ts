import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/users/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone, gender, dob, city, medicalNotes } = req.body;
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({ fullName, email, password, phone, gender, dob, city, medicalNotes });
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: '7d' },
    );
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: '7d' },
    );
    return res.json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const allowed = ['fullName', 'phone', 'emergencyContact', 'city', 'medicalNotes'];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, message: 'Profile updated.', data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
