import {createSlice} from '@reduxjs/toolkit';
import { endpointManagement } from '../../settings';
import { get, post, put } from '../../utils';

const staffEndpoint = endpointManagement + '/admin/staff/list';

export const slice = createSlice({
  name: 'staff',
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
      state.total_items = data.filtered_item;
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
  refresh
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

export const createStaff = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(staffEndpoint, data, headers,
    res => {
      history.push("/staff");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editStaff = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(staffEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/staff/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export default slice.reducer;
