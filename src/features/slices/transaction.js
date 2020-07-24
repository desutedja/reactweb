import { createSlice } from '@reduxjs/toolkit';
import { endpointTransaction } from '../../settings';
import { get, getFile } from '../slice';

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
      items: {
        data: []
      },
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
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,

    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadTransaction = (status = '', statusPayment = '', type = ''
) => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(transactionEndpoint + '/list' +
    '?status=' + status +
    '&payment_status=' + statusPayment +
    '&trx_type=' + type +
    '&sort_field=created_on' +
    '&sort_type=DESC' +
    '&export=true',
    'transaction_list.csv',
    res => {
      dispatch(stopAsync());
    }))
}

export const getTransactionDetails = (trx_code, history, url) => dispatch => {
  url = '/sa/transaction'

  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/' + trx_code,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/' + trx_code);

      dispatch(stopAsync())
    }))
}

export const getTransactionSettlement = (
  pageIndex, pageSize,
  search = '', settlementStatus = ''
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(transactionEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&settlement_status=' + settlementStatus +
    '&status=completed' +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,

    res => {
      dispatch(setSettlement(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadTransactionSettlement = (settlementStatus = '') => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(transactionEndpoint + '/list' +
    '?settlement_status=' + settlementStatus +
    '&status=completed' +
    '&export=true',
    'transaction_settlement.csv',
    res => {
      dispatch(stopAsync());
    }))
}

export const getTransactionDisbursement = (
  pageIndex, pageSize,
  search = '', type, merchant = '', courier = '',
  disbursementStatus = ''
) => dispatch => {

  dispatch(startAsync());

  dispatch(get(endpointTransaction + '/admin/disbursement/' + type +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&merchant_id=' + merchant +
    '&courier_id=' + courier +
    '&limit=' + pageSize +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search +
    '&disbursement_status=' + disbursementStatus,

    res => {
      dispatch(setDisbursement(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadTransactionDisbursement = (type, merchant = '', courier = '') => dispatch => {

  dispatch(startAsync());

  dispatch(getFile(endpointTransaction + '/admin/disbursement/' + type +
    '?merchant_id=' + merchant +
    '&courier_id=' + courier +
    '&export=true',
    'transaction_disbursement.csv',
    res => {
      dispatch(stopAsync());
    }))
}
