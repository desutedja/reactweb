import { createSlice } from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { post, get, del, put } from '../../utils';

const buildingEndpoint = endpointAdmin + '/building';

export const slice = createSlice({
  name: 'building',
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
    unit: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    unit_type: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    section: {
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
    setAlert: (state, action) => {
      state.alert.type = action.payload.type;
      state.alert.message = action.payload.message;
    },
    setUnitData: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
    },
    setUnitTypeData: (state, action) => {
      const data = action.payload;

      state.unit_type.items = data.items;
      state.unit_type.total_items = data.filtered_item;
      state.unit_type.total_pages = data.filtered_page;
    },
    setSectionData: (state, action) => {
      const data = action.payload;

      state.section.items = data.items;
      state.section.total_items = data.filtered_item;
      state.section.total_pages = data.filtered_page;
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
  setUnitData,
  setUnitTypeData,
  setSectionData
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

export const editBuilding = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  put(buildingEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/building/details");

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBuilding = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(buildingEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Building ' + row.name + ' has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync())
    })
}

export const getBuildingDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  get(buildingEndpoint + '/details/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    })
}

export const getBuildingUnit = (
  headers, pageIndex, pageSize, search, row
) => dispatch => {
  dispatch(startAsync());

  get(buildingEndpoint + '/unit' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setUnitData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getBuildingUnitType = (
  headers, pageIndex, pageSize, search, row
) => dispatch => {
  dispatch(startAsync());

  get(buildingEndpoint + '/unit/type' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setUnitTypeData(res.data.data));

      dispatch(stopAsync());
    })
}

export const getBuildingSection = (
  headers, pageIndex, pageSize, search, row
) => dispatch => {
  dispatch(startAsync());

  get(buildingEndpoint + '/section' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setSectionData(res.data.data));

      dispatch(stopAsync());
    })
}

export const createBuildingUnit = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(buildingEndpoint + '/unit', data, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const createBuildingUnitType = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(buildingEndpoint + '/unit/type', data, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const createBuildingSection = (headers, data) => dispatch => {
  dispatch(startAsync());

  post(buildingEndpoint + '/section', data, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editBuildingUnit = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  put(buildingEndpoint + '/unit', {...data, id: id}, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editBuildingUnitType = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  put(buildingEndpoint + '/unit/type', {...data, id: id}, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const editBuildingSection = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  put(buildingEndpoint + '/section', {...data, id: id}, headers,
    res => {
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBuildingUnit = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(buildingEndpoint + '/unit/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Unit has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBuildingUnitType = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(buildingEndpoint + '/unit/type/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Unit Type has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export const deleteBuildingSection = (row, headers) => dispatch => {
  dispatch(startAsync());

  del(buildingEndpoint + '/section/' + row.id, headers,
    res => {
      dispatch(setAlert({
        type: 'normal',
        message: 'Section has been deleted.'
      }))
      setTimeout(() => dispatch(setAlert({
        message: '',
      })), 3000);
      dispatch(refresh());
      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    })
}

export default slice.reducer;
