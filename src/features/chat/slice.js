import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get,  } from '../slice';

const chatEndpoint = endpointAdmin + '/chat';

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
    rooms: [],
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
    setRooms: (state, action) => {
      state.rooms = action.payload;
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
  setRooms,
  updateMessages,
  setUnread
} = slice.actions;

export const getAdminChat = (
  topic,
  pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(chatEndpoint + "/admin" +
    '?topic=' + topic +
    '&page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    
    res => {
      dispatch(setRooms(res.data.data.items));
      console.log(res.data.data.items)

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const getPICBMChat = (
  topic,
  pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(chatEndpoint + "/staff" +
    '?topic=' + topic +
    '&page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    
    res => {
      dispatch(setRooms(res.data.data));
      console.log(res.data.data)

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export default slice.reducer;
