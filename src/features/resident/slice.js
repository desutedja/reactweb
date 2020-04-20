import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'resident',
  initialState: {
    loading: false,
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
  },
});

export const {
  startAsync,
  stopAsync
} = slice.actions;

export default slice.reducer;
