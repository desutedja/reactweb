import { createSlice } from '@reduxjs/toolkit';

import { endpointAds } from '../../settings';
import { get, post, put, del } from '../slice';
import { setInfo } from '../slice';

const adsEndpoint = endpointAds + '/management/ads';

export const slice = createSlice({
  name: 'ads',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    schedule: {
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
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    setScheduleData: (state, action) => {
      const data = action.payload;

      state.schedule.items = data.items;
      state.schedule.total_items = data.filtered_item;
      state.schedule.total_pages = data.filtered_page;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setScheduleData,
} = slice.actions;

export const getAds = (headers, pageIndex, pageSize, search = '', age_from, age_to) => dispatch => {
  dispatch(startAsync());

  dispatch(get(adsEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&age_from=' + age_from +
    '&age_to=' + age_to +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createAds = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(adsEndpoint, {
    ads: data
  }, headers,
    res => {
      history.push("/advertisement");

      dispatch(setInfo({
        color: 'success',
        message: 'Advertisement has been created.'
      }));
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editAds = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(adsEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/advertisement/details");

      dispatch(setInfo({
        color: 'success',
        message: 'Advertisement has been updated.'
      }));
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteAds = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(adsEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setInfo({
        color: 'success',
        message: 'Advertisement has been deleted.'
      }));

      dispatch(refresh());
      dispatch(stopAsync())
    }))
}

export const getAdsDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(adsEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const getAdsSchedule = (headers, pageIndex, pageSize, search, row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(adsEndpoint + '/schedule/' + row.id +
    '?page=' + (pageIndex + 1) +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setScheduleData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createAdsSchedule = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(adsEndpoint + '/schedule', data, headers,
    res => {
      dispatch(setInfo({
        color: 'success',
        message: 'Advertisement schedule has been added.'
      }));

      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteAdsSchedule = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(adsEndpoint + '/schedule/' + row.int, headers,
    res => {
      dispatch(setInfo({
        color: 'success',
        message: 'Advertisement schedule has been deleted.'
      }));

      dispatch(refresh());
      dispatch(stopAsync())
    }))
}

export default slice.reducer;
