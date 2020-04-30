import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, del, put } from '../../utils';

const buildingManagementEndpoint = endpointAdmin + '/management/building';

export const slice = createSlice({
  name: 'building_management',
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
  setAlert
} = slice.actions;

export const getBuildingManagement = (
  headers, pageIndex, pageSize,
  search = ''
) => dispatch => {
  dispatch(startAsync());

  get(buildingManagementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createBuildingManagement = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  post(buildingManagementEndpoint, data, headers,
    res => {
      history.push("/building_management");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editBuildingManagement = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(buildingManagementEndpoint, {...data, id: id}, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/building_management/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBuildingMangement = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(buildingManagementEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Building ' + row.building_name + ' with Management ' + 
        row.management_name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const getBuildingManagementDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(buildingManagementEndpoint + '/details/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}


export default slice.reducer;
