import {createSlice} from '@reduxjs/toolkit';
import { endpointInternet } from '../../settings';
import { get, post, put, del, setInfo, getFile, patch } from '../slice';

const internetEndpoint = endpointInternet + '/admin';

export const slice = createSlice({
  name: 'internet',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    internet: {
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
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh
} = slice.actions;

export default slice.reducer;

// export const getInternetProvider = ( pageIndex, pageSize, search = '', role, provider = "") => dispatch => {
//   dispatch(startAsync());

//   dispatch(get(internetEndpoint + '/provider' +
//     '?page=' + (pageIndex + 1) +
//     '&limit=' + pageSize +
//     '&search=' + search +
//     '&provider_id=' + provider,
    
//     res => {
//       dispatch(setData(res.data.data));
//       console.log(res);

//       dispatch(stopAsync());
//     },
//     err => {
//       dispatch(stopAsync());
//     }))
// }

// export const downloadStaff = ( pageIndex, pageSize, role, building, shift, search = '', department, management = '') => dispatch => {
//   dispatch(startAsync());

//   dispatch(getFile(staffEndpoint + '/list' +
//     '?page=' + (pageIndex + 1) +
//     '&limit=101' + 
//     '&search=' + search +
//     '&building_id=' + building +
//     '&department_ids=' + department +
//     '&staff_all=1' +
//     '&is_shift=' + (shift === 'yes' ? 1 : shift === 'no' ? 0 : '') +
//     '&staff_role=' + role +
//     // '&sort_field=created_on&sort_type=DESC' +
//     '&management=' + management +
//     '&download=1',
//     "Data_Staff.csv",
    
//     (res) => {
//       dispatch(stopAsync());
//     },
//     (err) => {
//       dispatch(stopAsync());
//     }))
// }

export const createInternetProvider = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointInternet + '/admin/provider',
      data,
      (res) => {
        history.push("/sa/internet");
        
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "New internet provider has been created.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const editInternetProvider = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    patch(
      endpointInternet + '/admin/provider',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/internet");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Internet provider has been updated.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const deleteInternetProvider = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      endpointInternet + '/admin/provider/' + row.id,
      row.id,
      (res) => {
        history && history.push("/" + auth.role + "/internet");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "danger",
            message: "Provider internet has been deleted.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const createInternetPackage = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    post(
      endpointInternet + '/admin/package',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/internet/" + data.provider_id);
        
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "New internet package has been created.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const editInternetPackage = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    patch(
      endpointInternet + '/admin/package',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/internet/" + data.provider_id);

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Internet package has been updated.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const deleteInternetPackage = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      endpointInternet + '/admin/package/' + row.id,
      row.id,
      (res) => {
        history && history.push("/" + auth.role + "/internet/" + row.provider_id);

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "danger",
            message: "Internet package has been deleted.",
          })
        );

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

// export const editStaff = ( data, history, id) => dispatch => {
//   dispatch(startAsync());

//   dispatch(put(staffEndpoint + '/update', { ...data, id: id }, 
//     res => {
//       // dispatch(setSelected(res.data.data));
//       history.push(`${id}`);

//       dispatch(setInfo({
//         color: 'success',
//         message: 'Staff has been updated.'
//       }));

//       dispatch(stopAsync());
//     },
//     err => {
//       dispatch(stopAsync());
//     }))
// }

// export const deleteStaff = (row, history) => (dispatch, getState) => {
//   dispatch(startAsync());

//   const { auth } = getState();

//   dispatch(del(staffEndpoint + '/delete?id=' + row.id, 
//     res => {
//       history && history.push('/' + auth.role + '/staff');

//       dispatch(refresh());
      
//       dispatch(setInfo({
//         color: 'success',
//         message: 'Staff has been deleted.'
//       }));

//       dispatch(stopAsync())
//     },
//     err => {
//       dispatch(stopAsync());
//     }))
// }

// export const getStaffDetails = (row,  history, url) => dispatch => {
//   dispatch(startAsync());

//   dispatch(get(staffEndpoint + '/' + row.id, 
//     res => {
//       dispatch(setSelected(res.data.data));
//       history.push(url + '/' + row.id);

//       dispatch(stopAsync())
//     },
//     err => {
//       dispatch(stopAsync());
//     }))
// }
