import { createSlice } from '@reduxjs/toolkit';
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
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
} = slice.actions;

export default slice.reducer;

export const getAnnoucement = (
   pageIndex, pageSize,
  search = '', consumer,
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(announcementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&sort_field=created_on&sort_type=DESC' +
    '&consumer_role=' + consumer +
    '&search=' + search,
    
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getAnnouncementDetails = (row, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(announcementEndpoint + '/preview/' + row.id, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/' + row.id);

      dispatch(stopAsync())
    }))
}

export const createAnnouncement = (data, history, role) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint, {...data, topic: "announcement"}, 
    res => {
      history.push("/" + role + "/announcement");

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement has been created.'
      }));

      dispatch(stopAsync());
      dispatch(refresh());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editAnnouncement = ( data, history, id, role ) => dispatch => {
  dispatch(startAsync());

  dispatch(put(announcementEndpoint, { ...data, topic: "announcement", id: id }, 
    res => {
      dispatch(setSelected(res.data.data));
        history.push("/" + role + "/announcement/" + id);

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

export const deleteAnnouncement = (row, history=null) => dispatch => {
  dispatch(startAsync());

  dispatch(del(announcementEndpoint + '/' + row.id, 
    res => {
      history && history.push('/announcement');
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement ID ' + row.id + ' has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const publishAnnouncement = ( data, history, role) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint + '/publish', { id: data.id }, 
    res => {
      dispatch(refresh());
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
