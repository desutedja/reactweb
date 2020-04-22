import { createSlice } from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { post, get } from '../../utils';

const buildingEndpoint = endpointAdmin + '/building';

export const slice = createSlice({
  name: 'building',
  initialState: {
    loading: false,
    items: [],
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
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
    }
  },
});

export const {
  startAsync,
  stopAsync,
  setData
} = slice.actions;

export const getBuilding = (
  headers, pageIndex, pageSize,
  search = '', province, city, district
) => dispatch => {
  dispatch(startAsync());

  get(buildingEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&province=' + province +
    '&city=' + city + 
    '&district=' + district,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createBuilding = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(buildingEndpoint, data, headers,
    res => {
      history.push("/building");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export default slice.reducer;
