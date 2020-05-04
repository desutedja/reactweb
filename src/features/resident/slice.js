import {createSlice} from '@reduxjs/toolkit';
import { endpointResident } from '../../settings';
import { get, post } from '../../utils';

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
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh
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

export const getResidentDetails = (id, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(residentEndpoint + '/detail/' + id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export default slice.reducer;