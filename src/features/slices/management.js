import {createSlice} from '@reduxjs/toolkit';
import { endpointAdmin } from '../../settings';
import { get, post, del, put, setInfo } from '../slice';

const managementEndpoint = endpointAdmin + '/management';

export const slice = createSlice({
  name: 'management',
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
  refresh,
} = slice.actions;

export const getManagement = (
  pageIndex, pageSize,
  search = '',
) => dispatch => {
  dispatch(startAsync());

  dispatch(get(managementEndpoint +
    '?page=' + (pageIndex + 1) +
    '&limit=' + pageSize +
    '&sort_field=created_on&sort_type=DESC' +
    '&search=' + search,
    
    res => {
      dispatch(setData(res.data.data));
      console.log(res.data.data)

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }
    ))
}

export const createManagement = ( data, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(managementEndpoint, data, 
    res => {
      history.push("/sa/management");

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been created.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const editManagement = ( data, history, id) => dispatch => {
  dispatch(startAsync());

  dispatch(put(managementEndpoint, {...data, id: id}, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(`${id}`);

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been updated.'
      }));

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const deleteManagement = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(del(managementEndpoint + '/' + row.id, 
    res => {
      history && history.push('/' + auth.role + '/management');
      
      dispatch(refresh());

      dispatch(setInfo({
        color: 'success',
        message: 'Management has been deleted.'
      }));

      dispatch(stopAsync())
    }))
}

export const getManagementDetails = (row,  history, url) => dispatch => {
  dispatch(startAsync());

  dispatch(get(managementEndpoint + '/details/' + row.id, 
    res => {
      dispatch(setSelected(res.data.data));
      history.push(url + '/details');

      dispatch(stopAsync())
    }))
}

export default slice.reducer;
