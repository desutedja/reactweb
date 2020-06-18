import {createSlice} from '@reduxjs/toolkit';
import { endpointManagement } from '../../settings';
import { get, post, put, del, setInfo } from '../slice';

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
      state.total_items = data.total_items;
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

export const getStaff = (headers, pageIndex, pageSize,search = '', role, building, shift) => dispatch => {
  dispatch(startAsync());

  dispatch(get(staffEndpoint + '/list' +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&search=' + search +
    '&building_id=' + building +
    '&is_shift=' + (shift === 'yes' ? 1 : shift === 'no' ? 0 : '') +
    '&staff_role=' + role,
    headers,
    res => {
      dispatch(setData(res.data.data));

      dispatch(stopAsync());
    }))
}

export const createStaff = (headers, data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(staffEndpoint + '/create', data, headers,
    res => {
      history.push("/staff");

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

export const editStaff = (headers, data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(staffEndpoint + '/update', { ...data, id: id }, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push("/staff/details");

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

export const deleteStaff = (row, headers) => dispatch => {
  dispatch(startAsync());

  dispatch(del(staffEndpoint + '/delete/' + row.id, headers,
    res => {
      dispatch(refresh());
      
      dispatch(setInfo({
        color: 'success',
        message: 'Staff has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const getStaffDetails = (row, headers, history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(staffEndpoint + '/' + row.id, headers,
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export default slice.reducer;
