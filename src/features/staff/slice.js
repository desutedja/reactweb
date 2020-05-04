import {createSlice} from '@reduxjs/toolkit';
import { endpointManagement } from '../../settings';
import { get } from '../../utils';

const staffEndpoint = endpointManagement + '/admin/staff/list';

export const slice = createSlice({
  name: 'staff',
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

export const getStaff = (
  headers, pageIndex, pageSize,
  search = '', role, building
) => dispatch => {
  dispatch(startAsync());

  get(staffEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&building_id=' + building +
    '&staff_role=' + role,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export default slice.reducer;