import { createSlice } from '@reduxjs/toolkit';
import { endpoint } from '../../settings';
import { post } from '../../utils';

export const slice = createSlice({
  name: 'building',
  initialState: {
    loading: false,
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
  },
});

export const {
  startAsync,
  stopAsync
} = slice.actions;

export const createBuilding = (token, data, history) => dispatch => {
  dispatch(startAsync());

  post(endpoint + '/building', data, {
    Authorization: "Bearer " + token
  }, 
  res => {
    dispatch(stopAsync());

    history.push("/building");
  })
}

export default slice.reducer;
