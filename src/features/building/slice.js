import { createSlice } from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { post, get, del, put } from '../slice';
import { setInfo } from '../slice';

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
    service: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    management: {
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
    setServiceData: (state, action) => {
      const data = action.payload;

      state.service.items = data.items;
      state.service.total_items = data.filtered_item;
      state.service.total_pages = data.filtered_page;
    },
    setManagementData: (state, action) => {
      const data = action.payload;

      state.management.items = data.items;
      state.management.total_items = data.filtered_item;
      state.management.total_pages = data.filtered_page;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setUnitData,
  setUnitTypeData,
  setSectionData,
  setServiceData,
  setManagementData
} = slice.actions;

export const getBuilding = (headers, pageIndex, pageSize, search = '', province, city, district) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&province=' + province +
    '&city=' + city +
    '&district=' + district,
    headers,
    res => {
      console.log(res);

      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createBuilding = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint, data, headers,
    res => {
      history.push("/building");

      dispatch(setInfo({
        color: 'success',
        message: 'Building has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuilding = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint, { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/building/details");

      dispatch(setInfo({
        color: 'success',
        message: 'Building has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuilding = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setInfo({
        color: 'success',
        message: 'Building has been deleted.'
      }));

      dispatch(refresh());
      dispatch(stopAsync())
    }))
}

export const getBuildingDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/details/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export const getBuildingUnit = (headers, pageIndex, pageSize, search, row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/unit' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setUnitData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingUnitType = (headers, pageIndex, pageSize, search, row, unit_type = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/unit/type' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&unit_type=' + unit_type +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setUnitTypeData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingSection = (headers, pageIndex, pageSize, search, row, section_type = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/section' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&section_type=' + section_type +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setSectionData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingService = (headers, pageIndex, pageSize, search, row, group = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/service' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&group=' + group +
    '&search=' + search +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setServiceData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingManagement = (headers, pageIndex, pageSize, search, row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/management' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&sort_type=desc' +
    '&sort_field=created_on' +
    '&limit=' + pageSize,
    headers,
    res => {
      dispatch(setManagementData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createBuildingUnit = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/unit', data, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building unit has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const createBuildingUnitType = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/unit/type', data, headers,
    res => {
      dispatch(refresh());
      
      dispatch(setInfo({
        color: 'success',
        message: 'Building unit type has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const createBuildingSection = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/section', data, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building section has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const createBuildingManagement = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/management', data, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building management has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const createBuildingService = (headers, data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/service', data, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building service has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuildingUnit = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/unit', {...data, id: id}, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building unit has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuildingUnitType = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/unit/type', {...data, id: id}, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building unit type has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuildingSection = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/section', {...data, id: id}, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building section has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuildingManagement = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/management', {...data, id: id}, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building mangement has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editBuildingService = (headers, data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/service', {...data, id: id}, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building service has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuildingUnit = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/unit/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building unit has been deleted.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuildingUnitType = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/unit/type/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building unit type has been deleted.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuildingSection = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/section/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building section has been deleted.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuildingManagement = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/management/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building management has been deleted.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteBuildingService = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/service/' + row.id, headers,
    res => {
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Building service has been deleted.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export default slice.reducer;
