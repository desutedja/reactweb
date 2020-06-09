import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, put, del } from '../../utils';

const announcementEndpoint = endpointAdmin + '/announcement';

export const slice = createSlice({
  name: 'announcement',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    alert: {
      type: 'normal',
      message: '',
    },
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
    setData: (state, action) => {
      const data = action.payload;

      state.items = data.items;
      state.total_items = data.total_items;
      state.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    setAlert: (state, action) => {
      state.alert.type = action.payload.type;
      state.alert.message = action.payload.message;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setAlert
} = slice.actions;

export default slice.reducer;

export const getAnnoucement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  get(announcementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getAnnouncementDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(announcementEndpoint + '/preview/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export const createAnnouncement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(announcementEndpoint, {...data, topic: "announcement"}, headers,
    res => {
      history.push("/announcement");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editAnnouncement = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(announcementEndpoint, { ...data, topic: "announcement", id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/announcement/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteAnnouncement = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(announcementEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Announcement ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}