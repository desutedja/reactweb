import {createSlice} from '@reduxjs/toolkit';
import { endpointTask } from '../../settings';
import { get } from '../slice';

const chartEndpoint = endpointTask + '/admin/chart';

export const slice = createSlice({
  name: 'dashboard',
  initialState: {
    loading: false,
    sosData: [],
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

      state.sosData = data;
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
  refresh
} = slice.actions;

export const getSOS = (
   range
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(chartEndpoint + '/sos/statistics' + 
    '?timegroup=' + range +
    '&limit=',
    
    res => {
      console.log(res);

      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export default slice.reducer;
