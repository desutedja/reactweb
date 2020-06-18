import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, del, put, setInfo } from '../slice';

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
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
} = slice.actions;

export const getManagement = (
  headers, pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(managementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createManagement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(managementEndpoint, data, headers,
    res => {
      history.push("/management");

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editManagement = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(managementEndpoint, {...data, id: id}, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/management/details");

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteManagement = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(managementEndpoint + '/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const getManagementDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(managementEndpoint + '/details/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export default slice.reducer;
