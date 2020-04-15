import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    }
  },
});

export const {
  loginSuccess,
  logout
} = slice.actions;

export default slice.reducer;
