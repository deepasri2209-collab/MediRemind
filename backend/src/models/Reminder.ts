import mongoose, { Schema, Document } from 'mongoose';

// ─── Reminder Schedule ────────────────────────────────────────────────────────
export interface IReminder extends Document {
  userId:           mongoose.Types.ObjectId;
  medicineId:       mongoose.Types.ObjectId;
  medicineName:     string;
  dosage:           string;
  scheduledTime:    string;
  status:           'Pending' | 'Taken' | 'Missed';
  takenAt?:         string;
  date:             string;
  createdAt:        Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User',     required: true },
    medicineId:    { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName:  { type: String, required: true },
    dosage:        { type: String, required: true },
    scheduledTime: { type: String, required: true },
    status:        { type: String, enum: ['Pending', 'Taken', 'Missed'], default: 'Pending' },
    takenAt:       { type: String },
    date:          { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IReminder>('Reminder', ReminderSchema);

// ─── Reminder History ─────────────────────────────────────────────────────────
export interface IHistory extends Document {
  userId:          mongoose.Types.ObjectId;
  reminderId:      mongoose.Types.ObjectId;
  medicineDetails: {
    name:          string;
    dosage:        string;
    frequency:     string;
    reminderTime:  string;
  };
  status:          'Taken' | 'Missed';
  actionAt:        Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User',     required: true },
    reminderId:  { type: Schema.Types.ObjectId, ref: 'Reminder', required: true },
    medicineDetails: {
      name:         { type: String, required: true },
      dosage:       { type: String, required: true },
      frequency:    { type: String, required: true },
      reminderTime: { type: String, required: true },
    },
    status:    { type: String, enum: ['Taken', 'Missed'], required: true },
    actionAt:  { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const History = mongoose.model<IHistory>('History', HistorySchema);
