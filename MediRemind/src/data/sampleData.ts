import {
  Medicine,
  Reminder,
  MedicineCategory,
  User,
  ReminderSettings,
} from '../types';

export const SAMPLE_USER: User = {
  id: 'u1',
  fullName: 'Deepasri D',
  email: 'deepasrid@student.tce.edu',
  phone: '9876543210',
  emergencyContact: '9123456780',
  gender: 'Female',
  dob: '2002-04-15',
  city: 'Madurai',
  medicalNotes: 'Allergic to penicillin.',
};

export const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: 'm1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    reminderTime: '08:00',
    notes: 'Take after meals.',
    isActive: true,
    category: 'Diabetes',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'm2',
    name: 'Amlodipine',
    dosage: '5 mg',
    frequency: 'Once daily',
    reminderTime: '09:00',
    notes: 'Take with water.',
    isActive: true,
    category: 'Blood Pressure',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'm3',
    name: 'Vitamin D3',
    dosage: '60,000 IU',
    frequency: 'Weekly',
    reminderTime: '10:00',
    notes: 'Take after breakfast.',
    isActive: true,
    category: 'Vitamins',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'm4',
    name: 'Atorvastatin',
    dosage: '10 mg',
    frequency: 'Once daily',
    reminderTime: '21:00',
    notes: 'Take at night.',
    isActive: true,
    category: 'Cholesterol',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'm5',
    name: 'Aspirin',
    dosage: '75 mg',
    frequency: 'Once daily',
    reminderTime: '08:30',
    notes: 'Take after breakfast.',
    isActive: false,
    category: 'Heart',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

export const SAMPLE_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    medicineId: 'm1',
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '08:00',
    status: 'Taken',
    takenAt: '08:05',
    date: '2026-09-25',
  },
  {
    id: 'r2',
    medicineId: 'm2',
    medicineName: 'Amlodipine',
    dosage: '5 mg',
    scheduledTime: '09:00',
    status: 'Pending',
    date: '2026-09-25',
  },
  {
    id: 'r3',
    medicineId: 'm3',
    medicineName: 'Vitamin D3',
    dosage: '60,000 IU',
    scheduledTime: '10:00',
    status: 'Missed',
    date: '2026-09-24',
  },
  {
    id: 'r4',
    medicineId: 'm4',
    medicineName: 'Atorvastatin',
    dosage: '10 mg',
    scheduledTime: '21:00',
    status: 'Pending',
    date: '2026-09-25',
  },
  {
    id: 'r5',
    medicineId: 'm1',
    medicineName: 'Metformin',
    dosage: '500 mg',
    scheduledTime: '20:00',
    status: 'Pending',
    date: '2026-09-25',
  },
];

export const SAMPLE_CATEGORIES: MedicineCategory[] = [
  { id: 'c1', name: 'Diabetes',       icon: '💊', color: '#4A90E2' },
  { id: 'c2', name: 'Blood Pressure', icon: '❤️', color: '#E74C3C' },
  { id: 'c3', name: 'Vitamins',       icon: '🌟', color: '#F39C12' },
  { id: 'c4', name: 'Cholesterol',    icon: '🫀', color: '#9B59B6' },
  { id: 'c5', name: 'Heart',          icon: '💓', color: '#E91E63' },
  { id: 'c6', name: 'Antibiotics',    icon: '🧬', color: '#2ECC71' },
];

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enableReminders: true,
  notificationSound: 'Default',
  snoozeDuration: 10,
  additionalNotes: '',
};

export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Weekly',
  'As needed',
];

export const CITY_OPTIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli',
  'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul',
];

export const NOTIFICATION_SOUND_OPTIONS = [
  'Default', 'Chime', 'Bell', 'Beep', 'Silent',
];
