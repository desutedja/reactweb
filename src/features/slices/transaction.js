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
    },
    disbursement: {
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
      state.total_items = data.filtered_item;
      state.total_pages = data.filtered_page;
    },
    setSettlement: (state, action) => {
      const data = action.payload;

      state.settlement.items = data.items;
      state.settlement.total_items = data.filtered_item;
      state.settlement.total_pages = data.filtered_page;
    },
    setDisbursement: (state, action) => {
      const data = action.payload;

      state.disbursement.items = data.items;
      state.disbursement.total_items = data.filtered_item;
      state.disbursement.total_pages = data.filtered_page;
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
  setDisbursement,
  refresh
} = slice.actions;

export default slice.reducer;

export const getTransaction = (
   pageIndex, pageSize,
  search = '', status = '', statusPayment = '', type = ''
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&status=' + status +
    '&payment_status=' + statusPayment +
    '&trx_type=' + type +
    '&sort_field=created_on' +
    '&sort_type=DESC' +
    '&search=' + search,
    
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getTransactionDetails = (row,  history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/' + row.trx_code, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const getTransactionSettlement = (
   pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&settlement_status=undisbursed'+
    '&status=completed' +
    '&search=' + search,
    
    res => {
      dispatch(setSettlement(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getTransactionDisbursement = (
   pageIndex, pageSize,
  search = '', type, merchant = '', courier = ''
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(endpointTransaction + '/admin/disbursement/' + type +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&merchant_id=' + merchant +
    '&courier_id=' + courier +
    '&limit=' + pageSize +
    '&search=' + search,
    
    res => {
      dispatch(setDisbursement(res.data.data));

      dispatch(stopAsync());
    }))
}