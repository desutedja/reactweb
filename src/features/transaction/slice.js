import {createSlice} from '@reduxjs/toolkit';
import { endpointTransaction } from '../../settings';
import { get } from '../../utils';

const transactionEndpoint = endpointTransaction + '/admin/transaction';

export const slice = createSlice({
  name: 'transaction',
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
      state.total_items = data.total_items;
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

export const getTransaction = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getTransactionDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(transactionEndpoint + '/' + row.trx_code, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}