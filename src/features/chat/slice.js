import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    loading: false,
    source: 'Task',
    roomID: '',
    participants: [],
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
  stopAsync,
} = slice.actions;

export default slice.reducer;
