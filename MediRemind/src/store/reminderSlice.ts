import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder, ReminderStatus } from '../types';
import { SAMPLE_REMINDERS } from '../data/sampleData';

interface RemindersState {
  reminders: Reminder[];
}

const initialState: RemindersState = {
  reminders: SAMPLE_REMINDERS,
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    addReminder(state, action: PayloadAction<Reminder>) {
      state.reminders.unshift(action.payload);
    },
    updateReminderStatus(
      state,
      action: PayloadAction<{ id: string; status: ReminderStatus }>,
    ) {
      const reminder = state.reminders.find(r => r.id === action.payload.id);
      if (reminder) {
        reminder.status = action.payload.status;
        if (action.payload.status === 'Taken') {
          reminder.takenAt = new Date().toTimeString().slice(0, 5);
        }
      }
    },
    removeReminder(state, action: PayloadAction<string>) {
      state.reminders = state.reminders.filter(r => r.id !== action.payload);
    },
    setReminders(state, action: PayloadAction<Reminder[]>) {
      state.reminders = action.payload;
    },
  },
});

export const {
  addReminder,
  updateReminderStatus,
  removeReminder,
  setReminders,
} = reminderSlice.actions;

export default reminderSlice.reducer;
