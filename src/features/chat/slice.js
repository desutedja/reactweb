import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    qiscus: null,
    loading: false,
    source: 'Task',
    roomID: '17159434',
    participants: [],
    messages: [],
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
    },
    setQiscus: (state, action) => {
      state.qiscus = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setRoomID,
  setQiscus,
  setMessages,
  updateMessages,
} = slice.actions;

export default slice.reducer;
