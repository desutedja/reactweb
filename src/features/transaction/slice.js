import { createSlice } from '@reduxjs/toolkit';
import { endpointTransaction } from '../../settings';
import { get } from '../slice';

const transactionEndpoint = endpointTransaction + '/admin/transaction';

export const slice = createSlice({
  name: 'transaction',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    refreshToggle: true,
    settlement: {
      items: [],
      selected: {},
      total_items: 0,
      total_pages: 1,
    }
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
    setSettlement: (state, action) => {
      const data = action.payload;

      state.settlement.items = data.items;
      state.settlement.total_items = data.total_items;
      state.settlement.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
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
  setSettlement,
  setSelected,
  refresh
} = slice.actions;

export default slice.reducer;

export const getTransaction = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getTransactionDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/' + row.trx_code, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const getTransactionSettlement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&status=completed' +
    '&search=' + search,
    headers,
    res => {
      dispatch(setSettlement(res.data.data));

      dispatch(stopAsync());
    }))
}