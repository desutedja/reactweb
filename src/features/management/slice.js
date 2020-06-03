import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, del, put } from '../../utils';

const managementEndpoint = endpointAdmin + '/management';

export const slice = createSlice({
  name: 'management',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    alert: {},
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
  setAlert,
} = slice.actions;

export const getManagement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  get(managementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createManagement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(managementEndpoint, data, headers,
    res => {
      history.push("/management");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editManagement = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(managementEndpoint, {...data, id: id}, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/management/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteManagement = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(managementEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Management ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const getManagementDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(managementEndpoint + '/details/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export default slice.reducer;
