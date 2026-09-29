// ─────────────────────────────────────────────
//  Smart Medicine Reminder – Global Types
// ─────────────────────────────────────────────

export type ReminderStatus = 'Taken' | 'Pending' | 'Missed';
export type Frequency = 'Once daily' | 'Twice daily' | 'Three times daily' | 'Weekly' | 'As needed';
export type Gender = 'Male' | 'Female' | 'Other' | '';
export type NotificationSound = 'Default' | 'Chime' | 'Bell' | 'Beep' | 'Silent';

// ── User ──────────────────────────────────────
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  gender?: Gender;
  dob?: string;
  city?: string;
  medicalNotes?: string;
  profilePicture?: string;
}

// ── Medicine ──────────────────────────────────
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  reminderTime: string;   // HH:MM
  startDate?: string;
  endDate?: string;
  instructions?: string;
  notes?: string;
  isActive: boolean;
  category?: string;
  createdAt: string;
}

// ── Reminder ──────────────────────────────────
export interface Reminder {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  status: ReminderStatus;
  takenAt?: string;
  date: string;
}

// ── Reminder Settings ─────────────────────────
export interface ReminderSettings {
  enableReminders: boolean;
  notificationSound: NotificationSound;
  snoozeDuration: number;   // minutes
  additionalNotes?: string;
}

// ── Medicine Category ─────────────────────────
export interface MedicineCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// ── Navigation Param Lists ────────────────────
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  MedicineDetails: { medicine: Medicine };
  EditMedicine: { medicine: Medicine };
};

export type TabParamList = {
  Home: undefined;
  Medicines: undefined;
  AddMedicine: undefined;
  ReminderHistory: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  TabHome: undefined;
  ReminderSettings: undefined;
  NotificationPreferences: undefined;
  MedicineCategories: undefined;
  HelpSupport: undefined;
  Logout: undefined;
};
