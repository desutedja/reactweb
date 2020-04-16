import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      let history = action.payload;

      history.push("/otp");
    },
    otpSuccess: (state, action) => {
      let history = action.payload;

      state.isAuthenticated = true;
      history.push("/");
    },
    logout: (state) => {
      state.isAuthenticated = false;
    }
  },
});

export const {
  loginSuccess,
  otpSuccess,
  logout
} = slice.actions;

export default slice.reducer;
