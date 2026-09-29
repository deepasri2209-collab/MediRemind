import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName:         string;
  email:            string;
  password:         string;
  phone:            string;
  emergencyContact?: string;
  gender?:          string;
  dob?:             string;
  city?:            string;
  medicalNotes?:    string;
  profilePicture?:  string;
  createdAt:        Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName:         { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:         { type: String, required: true, minlength: 6 },
    phone:            { type: String, required: true },
    emergencyContact: { type: String },
    gender:           { type: String, enum: ['Male', 'Female', 'Other'] },
    dob:              { type: String },
    city:             { type: String },
    medicalNotes:     { type: String },
    profilePicture:   { type: String },
  },
  { timestamps: true },
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
