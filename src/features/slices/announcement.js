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
   pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(announcementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
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

export const createAnnouncement = ( data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint, {...data, topic: "announcement"}, 
    res => {
      history.push("/sa/announcement");

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

export const editAnnouncement = ( data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(announcementEndpoint, { ...data, topic: "announcement", id: id }, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/sa/announcement/details");

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
      history && history.push('/sa/announcement');
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Announcement ID ' + row.id + ' has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const publishAnnouncement = ( data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(announcementEndpoint + '/publish', { id: data.id }, 
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
