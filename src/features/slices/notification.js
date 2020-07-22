import { createSlice } from '@reduxjs/toolkit';

import { endpointManagement } from '../../settings';
import { get, post, put, del } from '../slice';

const notifEndpoint = endpointManagement + '/admin/notification';

export const slice = createSlice({
  name: 'notification',
  initialState: {
    loading: false,
    unreadCount: 0,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
    setNotificationData: (state, action) => {
      const data = action.payload;

      state.items = data.items;
      state.total_items = data.filtered_item;
      state.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setNotificationData,
  setSelected,
  refresh,
  setUnreadCount,
} = slice.actions;

export default slice.reducer;

export const getUnreadNotifications = () => dispatch => {
  dispatch(startAsync());

  dispatch(get(notifEndpoint + '/unread_count',
    res => {
      dispatch(setUnreadCount(res.data.data));

      dispatch(stopAsync())
    }))
}

export const getNotifications = () => dispatch => {
  dispatch(startAsync());

  dispatch(get(notifEndpoint,
    res => {
      dispatch(setNotificationData(res.data.data));

      dispatch(stopAsync())
    }))
}

export const getNotificationDetails = (row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(notifEndpoint + '/' + row.id,
    res => {
      dispatch(setSelected(res.data.data));

      dispatch(stopAsync())
    }))
}

