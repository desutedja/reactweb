import {createSlice} from '@reduxjs/toolkit';
import { endpointMerchant } from '../../settings';
import { get, post, del, patch } from '../../utils';


const merchantEndpoint = endpointMerchant + '/admin';

export const slice = createSlice({
  name: 'merchant',
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
  refresh,
  setAlert
} = slice.actions;

export default slice.reducer;

export const getMerchant = (
  headers, pageIndex, pageSize,
  search = '', type, category
) => dispatch => {
  dispatch(startAsync());

  get(merchantEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&type=' + type +
    '&category=' + category +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getMerchantDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(merchantEndpoint + '?id=' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export const createMerchant = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(merchantEndpoint , data, headers,
    res => {
      history.push("/merchant");
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editMerchant = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  patch(merchantEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/merchant/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteMerchant = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(merchantEndpoint + '?id=' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Merchant ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}
