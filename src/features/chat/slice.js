import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    qiscus: null,
    loading: false,
    source: 'Task',
    roomID: '',
    roomUniqueID: '',
    unread: '',
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
    setRoomUniqueID: (state, action) => {
      state.roomUniqueID = action.payload;
    },
    setQiscus: (state, action) => {
      state.qiscus = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateMessages: (state, action) => {
      state.messages = [...state.messages, ...action.payload];
    },
    setUnread: (state, action) => {
      state.unread = action.payload;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setRoomID,
  setRoomUniqueID,
  setQiscus,
  setMessages,
  updateMessages,
  setUnread
} = slice.actions;

export default slice.reducer;
