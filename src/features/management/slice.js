import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get } from '../../utils';

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
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setData
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

export default slice.reducer;
