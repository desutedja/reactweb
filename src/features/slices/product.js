import { createSlice } from '@reduxjs/toolkit';
import { endpointMerchant } from '../../settings';
import { get, patch, setInfo } from '../slice';

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
    setAdminFee: (state, action) => {
      state.selected.admin_fee = action.payload;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setAdminFee,
} = slice.actions;

export default slice.reducer;

export const getProduct = (
   pageIndex, pageSize,
  search = '', merchant, category, type
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(merchantEndpoint + '/items/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&merchant_id=' + merchant +
    '&category_id=' + category +
    '&merchant_type=' + type +
    '&search=' + search,
    
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getProductDetails = (row,  history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(merchantEndpoint + '/items?id=' + row.id, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const patchAdminFee = ( data, item) => dispatch => {
  dispatch(startAsync());

  dispatch(patch(merchantEndpoint + '/items/adjust_fee', data, 
    res => {
      dispatch(setAdminFee(res.data.data.admin_fee));

      dispatch(setInfo({
        color: 'success',
        message: 'Admin fee has been updated.'
      }));

      dispatch(refresh());
    },
    err => {

    }
  ))
}
