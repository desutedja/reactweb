import { createSlice } from '@reduxjs/toolkit';
import { endpointBilling } from '../../settings';
import { get, post, put, del, getFile } from '../slice';
import { setInfo } from '../slice';

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
      state.total_items = data.filtered_item;
      state.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    setUnit: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
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
  setUnit,
  setSettlement,
  setDisbursement,
  setSelectedUnit,
  setUnitPaid,
} = slice.actions;

export default slice.reducer;

export const getBillingUnit = (pageIndex, pageSize, search = '', building, unit) => dispatch => {
  dispatch(startAsync());

  dispatch(get(billingEndpoint + '/unit' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&sort_field=created_on&sort_type=DESC' +
    '&resident_building=' + building +
    '&search=' + search,

    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadBillingUnit = (search = '', building) => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(billingEndpoint + '/unit' +
    '?search=' + search +
    '&resident_building=' + building +
    '&export=true',
    'billing_unit.csv',
    res => {
      dispatch(stopAsync());
    }))
}

export const getBillingSettlement = (pageIndex, pageSize, search = '', building, unit) => dispatch => {
  dispatch(startAsync());

  dispatch(get(billingEndpoint + '/settlement' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&building_id=' + building +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,

    res => {
      dispatch(setSettlement(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadBillingSettlement = (search = '', building) => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(billingEndpoint + '/settlement' +
    '?building_id=' + building +
    '&search=' + search +
    '&export=true',
    'billing_settlement.csv',
    res => {
      dispatch(stopAsync());
    }))
}

export const getBillingDisbursement = (pageIndex, pageSize, search = '', building, unit,) => dispatch => {
  dispatch(startAsync());

  dispatch(get(billingEndpoint + '/disbursement/list/management' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,

    res => {
      dispatch(setDisbursement(res.data.data));

      dispatch(stopAsync());
    }))
}

export const downloadBillingDisbursement = () => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(billingEndpoint + '/disbursement/list/management' +
    '?export=true',
    'billing_disbursement.csv',
    res => {
      dispatch(stopAsync());
    }))
}

export const getBillingUnitDetails = (row, history, url) => dispatch => {
  dispatch(setSelected(row));
  history.push(url + '/item');
}

export const getBillingUnitItem = (pageIndex, pageSize, search = '', selected, status) => dispatch => {
  dispatch(startAsync());

  dispatch(get(billingEndpoint + '/unit/group' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&unit_id=' + selected.id +
    '&building_id=' + selected.building_id +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,

    res => {
      dispatch(setUnit(res.data.data));

      dispatch(stopAsync());
    }))
}


export const getBillingUnitItemDetails = (row, history, url) => dispatch => {
  dispatch(setSelectedUnit(row));
  history.push(url + '/details');
}

export const createBillingUnitItem = (data, selected, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(billingEndpoint, data,
    res => {
      history.goBack();

      dispatch(setInfo({
        color: 'success',
        message: 'Billing has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBillingUnitItem = (data, selected, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(billingEndpoint, { ...data, id: selected.id },
    res => {
      dispatch(setSelected(res.data.data));
      history.goBack();

      dispatch(setInfo({
        color: 'success',
        message: 'Billing has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBillingUnitItem = (id,) => dispatch => {
  dispatch(startAsync());

  dispatch(del(billingEndpoint + '/' + id,
    res => {
      dispatch(setInfo({
        color: 'success',
        message: 'Billing has been deleted.'
      }));

      dispatch(refresh());
      dispatch(stopAsync())
    }))
}

export const payByCash = (data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(billingEndpoint + '/cash', data, res => {
    dispatch(setInfo({
      color: 'success',
      message: 'Billing has been set as paid by cash.'
    }));

    dispatch(setUnitPaid());
    dispatch(stopAsync());
  }))
}