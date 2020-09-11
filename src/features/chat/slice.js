import { createSlice } from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, } from '../slice';

const chatEndpoint = endpointAdmin + '/chat';

export const slice = createSlice({
  name: 'chat',
  initialState: {
    qiscus: null,
    loading: false,
    loadingRooms: false,
    source: 'Task',
    room: '',
    roomID: '',
    roomUniqueID: '',
    unread: '',
    participants: [],
    messages: [],
    rooms: [],
    reloadList: false,
    lastMessageOnRoom: '',
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
    startLoadRooms: (state) => {
      state.loadingRooms = true;
    },
    stopLoadRooms: (state) => {
      state.loadingRooms = false;
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
    setRoom: (state, action) => {
      state.room = action.payload;
    },
    setReloadList: (state) => {
      state.reloadList = !state.reloadList;
    },
    setLastMessageOnRoom: (state, action) => {
      state.lastMessageOnRoom = action.payload;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  startLoadRooms,
  stopLoadRooms,
  setRoomID,
  setRoomUniqueID,
  setQiscus,
  setMessages,
  setReloadList,
  setRooms,
  setRoom,
  updateMessages,
  setLastMessageOnRoom,
  setUnread
} = slice.actions;

export const getAdminChat = (
  topic,
  pageIndex, pageSize,
  search = '', rooms
) => dispatch => {
  dispatch(startLoadRooms());

  dispatch(get(chatEndpoint + "/admin" +
    '?topic=' + topic +
    '&page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,

    res => {
      dispatch(setRooms(res.data.data.items));
      console.log(res.data.data.items)

      dispatch(stopLoadRooms());
    },
    err => {
      dispatch(stopLoadRooms());
    }))
}

export const getPICBMChat = (
  topic,
  pageIndex, pageSize,
  search = '', rooms
) => dispatch => {
  dispatch(startLoadRooms());

  dispatch(get(chatEndpoint + "/staff" +
    '?topic=' + topic +
    '&page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,

    res => {
      dispatch(setRooms(res.data.data.items));

      dispatch(stopLoadRooms());
    },
    err => {
      dispatch(stopLoadRooms());
    }))
}

export default slice.reducer;
