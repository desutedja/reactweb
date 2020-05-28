import {createSlice} from '@reduxjs/toolkit';
import { endpointBilling } from '../../settings';
import { get } from '../../utils';

const billingEndpoint = endpointBilling + '/management/billing';

export const slice = createSlice({
  name: 'billing',
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

export default slice.reducer;

export const getBilling = (
  headers, pageIndex, pageSize, search = '', building, unit, month, year
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&building_id=' + building +
    '&unit_id=' + unit +
    '&month=' + (month) +
    '&year=' + year +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}