import {createSlice} from '@reduxjs/toolkit';
import { endpointResident } from '../../settings';
import { get, post, del, put } from '../../utils';

const residentEndpoint = endpointResident + '/management/resident';

export const slice = createSlice({
  name: 'resident',
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
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    subaccount: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
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
    setUnitData: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
    },
    setSubaccountData: (state, action) => {
      const data = action.payload;

      state.subaccount.items = data.items;
      state.subaccount.total_items = data.filtered_item;
      state.subaccount.total_pages = data.filtered_page;
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
  setUnitData,
  setSubaccountData,
  setSelected,
  refresh,
  setAlert
} = slice.actions;

export const getResident = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  get(residentEndpoint + '/read' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&status=',
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createResident = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(residentEndpoint + '/register/parent', data, headers,
    res => {
      history.push("/resident");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editResident = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(residentEndpoint + '/edit', { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/resident/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteResident = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(residentEndpoint + '/delete/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Resident ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const getResidentDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(residentEndpoint + '/detail/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export const getSubaccount = (headers, pageIndex, pageSize, search, row) => dispatch => {
    dispatch(startAsync());

    get(residentEndpoint + '/subaccount' +
        '?page=' + (pageIndex + 1) +
        '&id=' + row.id + 
        '&limit=' + pageSize +
        '&search=' + search,
        headers,
        res => {
            dispatch(setSubaccountData(res.data.data));
            console.log("->", res);

            dispatch(stopAsync())
        }
    )
}

export const getResidentUnit = (headers, pageIndex, pageSize, search, row) => dispatch => {
    dispatch(startAsync());

    console.log("Getting");
    get(residentEndpoint + '/unit' + 
        '?page=' + (pageIndex + 1) +
        '&id=' + row.id + 
        '&limit=' + pageSize +
        '&search=' + search,
        headers,
        res => {
            console.log(res.data.data);
            dispatch(setUnitData(res.data.data));

            dispatch(stopAsync())
        }
    )
        
}

export const addResidentUnit = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(residentEndpoint + '/add_unit', data, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export default slice.reducer;
