import {createSlice} from '@reduxjs/toolkit';
import { endpointUserRequest } from '../../settings';
import { get, post, put, del, setInfo, getFile, patch } from '../slice';

export const slice = createSlice({
  name: 'userRequest',
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    userRequest: {
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

export const getUserRequest = ( pageIndex, pageSize, search = '', cat, subCat, stat = '') => dispatch => {
  dispatch(startAsync());

  dispatch(get(endpointUserRequest + "/data/list" +
    "?page=" +
    (pageIndex + 1) +
    "&limit=" +
    pageSize +
    "&category_id=" +
    cat +
    "&sub_category_id=" +
    subCat +
    "&search=" +
    search +
    "&status=" +
    stat,
    
    (res) => {
      dispatch(setData(res.data.data));
      console.log(res);

      dispatch(stopAsync());
    },
    err => {
      dispatch(stopAsync());
    }))
}

export const createUserRequest = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    post(
      endpointUserRequest + '/data',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/user request");
        
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "New user request has been created.",
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

export const editUserRequest = (data, history, id) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    put(
      endpointUserRequest + '/data?request_id=' + id,
      data,
      (res) => {
        history && history.push("/" + auth.role + "/user request");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "User request has been updated.",
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

export const deleteUserRequest = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      endpointUserRequest + '/data?request_id=' + row.id,
      row.id,
      (res) => {
        history && history.push("/" + auth.role + "/user request");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "danger",
            message: "User request has been deleted.",
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

export const rejectUserRequest = (data, history, id) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    put(
      endpointUserRequest + '/data/action',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/user request/" + id);

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "User request has been rejected.",
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

export const approveUserRequest = (data, history, id) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    put(
      endpointUserRequest + '/data/action',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/user request/" + id);

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "User request has been approved and is in process.",
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

export const settledUserRequest = (data, history, id) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    put(
      endpointUserRequest + '/data/action',
      data,
      (res) => {
        history && history.push("/" + auth.role + "/user request/" + id);

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "User request has been settled.",
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