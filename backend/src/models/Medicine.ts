import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  userId:        mongoose.Types.ObjectId;
  name:          string;
  dosage:        string;
  frequency:     string;
  reminderTime:  string;
  notes?:        string;
  isActive:      boolean;
  category?:     string;
  createdAt:     Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name:         { type: String, required: true, trim: true },
    dosage:       { type: String, required: true },
    frequency:    { type: String, required: true,
                    enum: ['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'] },
    reminderTime: { type: String, required: true },
    notes:        { type: String },
    isActive:     { type: Boolean, default: true },
    category:     { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
