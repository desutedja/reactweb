import {createSlice} from '@reduxjs/toolkit';
import { endpointMerchant } from '../../settings';
import { get } from '../../utils';

const merchantEndpoint = endpointMerchant + '/admin';

export const slice = createSlice({
  name: 'product',
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

export const getProduct = (
  headers, pageIndex, pageSize,
  search = '', merchant, category
) => dispatch => {
  dispatch(startAsync());

  get(merchantEndpoint + '/items/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&merchant_id=' + merchant +
    '&category=' + category +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getProductDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(merchantEndpoint + '/items?id=' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}