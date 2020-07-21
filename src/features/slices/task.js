import { createSlice } from '@reduxjs/toolkit';
import { endpointTask } from '../../settings';
import { get, post } from '../slice';

const taskEndpoint = endpointTask + '/admin';

export const slice = createSlice({
  name: 'task',
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
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh
} = slice.actions;

export const getTask = (
  pageIndex, pageSize,
  search = '', type, prio, status,
  building
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(taskEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    //'&sort_field=created_on' + 
    '&sort_type=DESC' +
    '&type=' + type +
    '&priority=' + prio +
    '&requester_building_id=' + building +
    '&sort_field=created_on&sort_type=DESC' +
    '&status=' + status,

    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const resolveTask = (row) => dispatch => {
  dispatch(startAsync());

  dispatch(post(taskEndpoint + '/resolve?id=' + row.id, {},
    res => {
      dispatch(stopAsync());
      dispatch(refresh());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const reassignTask = (data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(taskEndpoint + '/assign', data,
    res => {
      dispatch(stopAsync());
      dispatch(refresh());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const getTaskDetails = (row, history) => dispatch => {
  dispatch(startAsync());

  dispatch(get(taskEndpoint + '/' + row.id,
    res => {
      dispatch(setSelected(res.data.data));

      dispatch(stopAsync())
    }))
}

export default slice.reducer;
