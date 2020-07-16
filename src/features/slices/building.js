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

export const getBuilding = ( pageIndex, pageSize, search = '', province, city, district) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&province=' + province +
    '&city=' + city +
    '&district=' + district,
    
    res => {
      // console.log(res);

      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createBuilding = ( data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint, data, 
    res => {
      history.push("/sa/building");

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

export const editBuilding = ( data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint, { ...data, id: id }, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(`${id}`);

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

export const deleteBuilding = (row, history) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/' + row.id, 
    res => {
      history && history.goBack();

      dispatch(setInfo({
        color: 'success',
        message: 'Building has been deleted.'
      }));

      dispatch(refresh());
      dispatch(stopAsync())
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const getBuildingDetails = (row,  history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/details/' + row.id, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/' + res.data.data.id);

      dispatch(stopAsync())
    }))
}

export const getBuildingUnit = ( pageIndex, pageSize, search, row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/unit' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&limit=' + pageSize,
    
    res => {
      dispatch(setUnitData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingUnitType = ( pageIndex, pageSize, search, row, unit_type = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/unit/type' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&unit_type=' + unit_type +
    '&limit=' + pageSize,
    
    res => {
      dispatch(setUnitTypeData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingSection = ( pageIndex, pageSize, search, row, section_type = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/section' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&section_type=' + section_type +
    '&search=' + search +
    '&limit=' + pageSize,
    
    res => {
      dispatch(setSectionData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingService = ( pageIndex, pageSize, search, row, group = "") => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/service' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&group=' + group +
    '&search=' + search +
    '&limit=' + pageSize,
    
    res => {
      dispatch(setServiceData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const getBuildingManagement = ( pageIndex, pageSize, search, row) => dispatch => {
  dispatch(startAsync());

  dispatch(get(buildingEndpoint + '/management' +
    '?page=' + (pageIndex + 1) +
    '&building_id=' + row.id +
    '&search=' + search +
    '&sort_type=desc' +
    '&sort_field=created_on' +
    '&limit=' + pageSize,
    
    res => {
      dispatch(setManagementData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const changeBuildingManagement = ( data ) => dispatch => {
  dispatch(startAsync())

  dispatch(post(buildingEndpoint + '/management/status', data, 
    res => {
      dispatch(refresh());
      console.log(res.data)

      dispatch(setInfo({
        color: 'success',
        message: 'Management status has been changed.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))

  dispatch(stopAsync())
}

export const createBuildingUnit = ( data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/unit', data, 
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

export const createBuildingUnitType = ( data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/unit/type', data, 
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

export const createBuildingSection = ( data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/section', data, 
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

export const createBuildingManagement = ( data) => dispatch => {
  dispatch(startAsync());

  dispatch(post(buildingEndpoint + '/management', data, 
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

export const createBuildingService = ( data ) => dispatch => {
  dispatch(startAsync());

  // console.log(data)

  dispatch(post(buildingEndpoint + '/service', data, 
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

export const editBuildingUnit = ( data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/unit', {...data, id: id}, 
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

export const editBuildingUnitType = ( data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/unit/type', {...data, id: id}, 
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

export const editBuildingSection = ( data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/section', {...data, id: id}, 
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

export const editBuildingManagement = ( data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/management', {...data, id: id}, 
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

export const editBuildingService = ( data, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(buildingEndpoint + '/service', {...data, id: id}, 
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

export const deleteBuildingUnit = (row, ) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/unit/' + row.id, 
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

export const deleteBuildingUnitType = (row, ) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/unit/type/' + row.id, 
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

export const deleteBuildingSection = (row, ) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/section/' + row.id, 
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

export const deleteBuildingManagement = (row, ) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/management/' + row.id, 
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

export const deleteBuildingService = (row, ) => dispatch => {
  dispatch(startAsync());

  dispatch(del(buildingEndpoint + '/service/' + row.id, 
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
