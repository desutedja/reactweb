import {createSlice} from '@reduxjs/toolkit';
import { endpointManagement } from '../../settings';
import { get, post, put, del, setInfo, getFile } from '../slice';

const staffEndpoint = endpointManagement + '/admin/staff';

export const slice = createSlice({
  name: 'staff',
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

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh
} = slice.actions;

export const getStaff = ( pageIndex, pageSize, search = '', role, building, shift, management, department) => dispatch => {
  dispatch(startAsync());

  dispatch(get(staffEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&building_id=' + building +
    '&department_ids=' + department +
    '&staff_all=1' +
    '&is_shift=' + (shift === 'yes' ? 1 : shift === 'no' ? 0 : '') +
    '&staff_role=' + role +
    // '&sort_field=created_on&sort_type=DESC' +
    '&management=' + management,
    
    res => {
      dispatch(setData(res.data.data));
      console.log(res);

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const downloadStaff = ( pageIndex, pageSize, role, building, shift, search = '', department, management = '') => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(staffEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=101' + 
    '&search=' + search +
    '&building_id=' + building +
    '&department_ids=' + department +
    '&staff_all=1' +
    '&is_shift=' + (shift === 'yes' ? 1 : shift === 'no' ? 0 : '') +
    '&staff_role=' + role +
    // '&sort_field=created_on&sort_type=DESC' +
    '&management=' + management +
    '&download=1',
    "Data_Staff.csv",
    
    (res) => {
      dispatch(stopAsync());
    },
    (err) => {
      dispatch(stopAsync());
    }))
}

export const downloadStaffLog = ( pageIndex, pageSize, role, building, shift, search = '', department, management = '') => dispatch => {
  dispatch(startAsync());

  dispatch(getFile(endpointManagement + '/admin/download/stafflog',
    "Data_Log_Staff.csv",
    
    (res) => {
      dispatch(stopAsync());
    },
    (err) => {
      dispatch(stopAsync());
    }))
}

export const createStaff = ( data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(post(staffEndpoint + '/create', data, 
    res => {
      history.push("/" + auth.role + "/staff");

      dispatch(setInfo({
        color: 'success',
        message: 'Staff has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editStaff = ( data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(staffEndpoint + '/update', { ...data, id: id }, 
    res => {
      // dispatch(setSelected(res.data.data));
      history.push(`${id}`);

      dispatch(setInfo({
        color: 'success',
        message: 'Staff has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteStaff = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(del(staffEndpoint + '/delete?id=' + row.id, 
    res => {
      history && history.push('/' + auth.role + '/staff');

      dispatch(refresh());
      
      dispatch(setInfo({
        color: 'success',
        message: 'Staff has been deleted.'
      }));

      dispatch(stopAsync())
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const getStaffDetails = (row,  history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(staffEndpoint + '/' + row.id, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/' + row.id);

      dispatch(stopAsync())
    },
    err => {
      dispatch(stopAsync());
    }))
}

export default slice.reducer;
