import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, del } from '../../utils';

const managementEndpoint = endpointAdmin + '/management';

export const slice = createSlice({
  name: 'management',
  initialState: {
    loading: false,
    items: [],
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
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  refresh,
} = slice.actions;

export const getManagement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  get(managementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createManagement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(managementEndpoint, data, headers,
    res => {
      history.push("/management");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteManagement = (id, headers) => dispatch => {
  dispatch(startAsync());

  del(managementEndpoint + '/' + id, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export default slice.reducer;
