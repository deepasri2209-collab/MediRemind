import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { SAMPLE_USER } from '../data/sampleData';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  currentUser: SAMPLE_USER,
  isLoggedIn:  false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isLoggedIn  = true;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    logout(state) {
      state.currentUser = null;
      state.isLoggedIn  = false;
    },
  },
});

export const { setCurrentUser, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
