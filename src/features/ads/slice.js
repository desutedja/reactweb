import { createSlice } from '@reduxjs/toolkit';
import { endpointAds } from '../../settings';
import { get, post, put, del } from '../../utils';

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
    alert: {
      type: 'normal',
      message: '',
    },
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
    setScheduleData: (state, action) => {
      const data = action.payload;

      state.schedule.items = data.items;
      state.schedule.total_items = data.total_items;
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
  setAlert,
  setScheduleData,
} = slice.actions;

export const getAds = (
  headers, pageIndex, pageSize,
  search = '', age_from, age_to
) => dispatch => {
  dispatch(startAsync());

  get(adsEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&age_from=' + age_from +
    '&age_to=' + age_to +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createAds = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(adsEndpoint, {
    ads: data
  }, headers,
    res => {
      history.push("/advertisement");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editAds = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(adsEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/advertisement/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteAds = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(adsEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Advertisement ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const getAdsDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(adsEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export const getAdsSchedule = (
  headers, pageIndex, pageSize, search, row
) => dispatch => {
  dispatch(startAsync());

  get(adsEndpoint + '/schedule/' + row.id +
    '?page=' + (pageIndex + 1) +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setScheduleData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createAdsSchedule = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(adsEndpoint + '/schedule', data, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export default slice.reducer;
