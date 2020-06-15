import { createSlice } from '@reduxjs/toolkit';
import { endpointBilling } from '../../settings';
import { get, post, put, del } from '../../utils';

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
    },
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
    setUnit: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.total_items;
      state.unit.total_pages = data.filtered_page;
    },
    setSettlement: (state, action) => {
      const data = action.payload;

      state.settlement.items = data.items;
      state.settlement.total_items = data.total_items;
      state.settlement.total_pages = data.filtered_page;
    },
    setDisbursement: (state, action) => {
      const data = action.payload;

      state.disbursement.items = data.items;
      state.disbursement.total_items = data.total_items;
      state.disbursement.total_pages = data.filtered_page;
    },
    setSelectedUnit: (state, action) => {
      state.unit.selected = action.payload;
    },
    setUnitPaid: (state) => {
      state.unit.selected.payment = 'paid';
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
  setSettlement,
  setDisbursement,
  setSelectedUnit,
  setUnitPaid,
} = slice.actions;

export default slice.reducer;

export const getBillingUnit = (
  headers, pageIndex, pageSize, search = '', building, unit,
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint + '/unit' +
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

export const getBillingSettlement = (
  headers, pageIndex, pageSize, search = '', building, unit,
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint + '/settlement' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&building_id=' + building +
    '&search=' + search,
    headers,
    res => {
      dispatch(setSettlement(res.data.data));

      dispatch(stopAsync());
    })
}

export const getBillingDisbursement = (
  headers, pageIndex, pageSize, search = '', building, unit,
) => dispatch => {
  dispatch(startAsync());

  get(billingEndpoint + '/disbursement/list/management' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setDisbursement(res.data.data));

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

  get(billingEndpoint + '/unit/group' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&unit_id=' + selected.id +
    '&building_id=' + selected.building_id +
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

export const createBillingUnitItem = (headers, data, selected, history) => dispatch => {
  dispatch(startAsync());

  post(billingEndpoint, {
    ...data,
    "resident_building": selected.building_id,
    "resident_unit": selected.id,
    "resident_id": selected.resident_id,
    "resident_name": selected.resident_name,
    'additional_charge': []
  }, headers,
    res => {
      history.goBack();

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editBillingUnitItem = (headers, data, selected, history, id) => dispatch => {
  dispatch(startAsync());

  put(billingEndpoint, { 'billing': { id: id, ...data } }, headers,
    res => {
      history.goBack();

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBillingUnitItem = (id, headers) => dispatch => {
  dispatch(startAsync());

  del(billingEndpoint + '/' + id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Billing Item with id: ' + id + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const payByCash = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(billingEndpoint + '/cash', data, headers, res => {
    dispatch(setUnitPaid());
    dispatch(stopAsync());
  })
}