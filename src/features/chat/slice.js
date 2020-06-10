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
    setRoomID: (state, action) => {
      state.roomID = action.payload;
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setRoomID
} = slice.actions;

export default slice.reducer;
