/**
 * Seed script — populates MongoDB with realistic sample data.
 * Run: npm run seed
 */
import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';
import dotenv   from 'dotenv';
import User     from './models/User';
import Medicine from './models/Medicine';
import Reminder, { History } from './models/Reminder';

dotenv.config();

const MONGO = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mediremind';

async function seed() {
  await mongoose.connect(MONGO);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany({}), Medicine.deleteMany({}), Reminder.deleteMany({}), History.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Create user
  const user = await User.create({
    fullName: 'Deepasri D',
    email:    'deepasrid@student.tce.edu',
    password: 'Admin@123',
    phone:    '9876543210',
    gender:   'Female',
    city:     'Madurai',
    medicalNotes: 'Allergic to penicillin.',
  });
  console.log('👤 User created:', user.email);

  // Create medicines
  const medicines = await Medicine.insertMany([
    { userId: user._id, name: 'Metformin',    dosage: '500 mg',     frequency: 'Twice daily',      reminderTime: '08:00', notes: 'Take after meals.',    isActive: true,  category: 'Diabetes' },
    { userId: user._id, name: 'Amlodipine',   dosage: '5 mg',       frequency: 'Once daily',       reminderTime: '09:00', notes: 'Take with water.',     isActive: true,  category: 'Blood Pressure' },
    { userId: user._id, name: 'Vitamin D3',   dosage: '60,000 IU',  frequency: 'Weekly',           reminderTime: '10:00', notes: 'After breakfast.',     isActive: true,  category: 'Vitamins' },
    { userId: user._id, name: 'Atorvastatin', dosage: '10 mg',      frequency: 'Once daily',       reminderTime: '21:00', notes: 'Take at night.',       isActive: true,  category: 'Cholesterol' },
    { userId: user._id, name: 'Aspirin',      dosage: '75 mg',      frequency: 'Once daily',       reminderTime: '08:30', notes: 'After breakfast.',     isActive: false, category: 'Heart' },
  ]);
  console.log(`💊 ${medicines.length} medicines created`);

  // Create reminders
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const reminders = await Reminder.insertMany([
    { userId: user._id, medicineId: medicines[0]._id, medicineName: 'Metformin',    dosage: '500 mg',    scheduledTime: '08:00', status: 'Taken',   takenAt: '08:05', date: today },
    { userId: user._id, medicineId: medicines[1]._id, medicineName: 'Amlodipine',   dosage: '5 mg',       scheduledTime: '09:00', status: 'Pending',                   date: today },
    { userId: user._id, medicineId: medicines[2]._id, medicineName: 'Vitamin D3',   dosage: '60,000 IU', scheduledTime: '10:00', status: 'Missed',                   date: yesterday },
    { userId: user._id, medicineId: medicines[3]._id, medicineName: 'Atorvastatin', dosage: '10 mg',     scheduledTime: '21:00', status: 'Pending',                   date: today },
    { userId: user._id, medicineId: medicines[0]._id, medicineName: 'Metformin',    dosage: '500 mg',    scheduledTime: '20:00', status: 'Pending',                   date: today },
  ]);
  console.log(`⏰ ${reminders.length} reminders created`);

  await mongoose.disconnect();
  console.log('✅ Seed complete! Database disconnected.');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
