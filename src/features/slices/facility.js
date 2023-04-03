import { createSlice } from "@reduxjs/toolkit";
import { endpointBookingFacility } from '../../settings';
import { get, post, put, del, setInfo, getFile } from '../slice';

export const slice = createSlice({
  name: "facility",
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

export const editFacility = ( data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(endpointBookingFacility + '/josss/update', { ...data, id: id }, 
    res => {
      // dispatch(setSelected(res.data.data));
      history.push(`${id}`);

      dispatch(setInfo({
        color: 'success',
        message: 'Facility has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
} = slice.actions;

export default slice.reducer;
