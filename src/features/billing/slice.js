import { createSlice } from '@reduxjs/toolkit';
import { endpointBilling } from '../../settings';
import { get, post } from '../../utils';

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
    unit: {
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
    setUnit: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
    },
    setSelectedUnit: (state, action) => {
      state.unit.selected = action.payload;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setAlert,
  setUnit,
  setSelectedUnit
} = slice.actions;

export default slice.reducer;

export const getBillingUnit = (
  headers, pageIndex, pageSize, search = '', building, unit,
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint + '/unit/unpaid' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&resident_building=' + building +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getBillingUnitDetails = (row, headers, history, url) => dispatch => {
  dispatch(setSelected(row));
  history.push(url + '/item');
}

export const getBillingUnitItem = (
  headers, pageIndex, pageSize, search = '', selected, status
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint + '/unit/item' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&resident_unit=' + selected.resident_unit +
    '&resident_building=' + selected.resident_building +
    '&resident_id=' + selected.resident_id +
    '&payment=' + status +
    '&search=' + search,
    headers,
    res => {
      dispatch(setUnit(res.data.data));

      dispatch(stopAsync());
    })
}

export const getBillingUnitItemDetails = (row, headers, history, url) => dispatch => {
  dispatch(setSelectedUnit(row));
  history.push(url + '/details');
}

export const createBillingUnitItem = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(billingEndpoint, {'billing': data}, headers,
    res => {
      history.goBack();

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}