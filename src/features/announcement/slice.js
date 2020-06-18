import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, put, del, setInfo } from '../slice';

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
      state.total_items = data.filtered_item;
      state.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    publish: (state) => {
      state.selected.publish = 1;
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  publish
} = slice.actions;

export default slice.reducer;

export const getAnnoucement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(announcementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getAnnouncementDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(announcementEndpoint + '/preview/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const createAnnouncement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint, {...data, topic: "announcement"}, headers,
    res => {
      history.push("/announcement");

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editAnnouncement = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(announcementEndpoint, { ...data, topic: "announcement", id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/announcement/details");

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteAnnouncement = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(announcementEndpoint + '/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const publishAnnouncement = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint + '/publish', { id: data.id }, headers,
    res => {
      dispatch(publish());

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement published.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}