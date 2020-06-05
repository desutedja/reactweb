import {createSlice} from '@reduxjs/toolkit';
import { endpointTask } from '../../settings';
import { get, post } from '../../utils';

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
      state.total_items = data.total_items;
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
  headers, pageIndex, pageSize,
  search = '', type, prio, status,
  building
) => dispatch => {
  dispatch(startAsync());

  get(taskEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search + 
      //'&sort_field=created_on' + 
    '&sort_type=DESC' + 
    '&type=' + type +
    '&priority=' + prio +
    '&requester_building_id=' + building +
    '&status=' + status,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const resolveTask = (headers, row) => dispatch => {
  dispatch(startAsync());

  post(taskEndpoint + '/resolve/' + row.id, {}, headers,
    res => {
      dispatch(stopAsync());
      dispatch(refresh());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const reassignTask = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(taskEndpoint + '/assign', data, headers,
    res => {
      dispatch(stopAsync());
      dispatch(refresh());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const getTaskDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(taskEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export default slice.reducer;
