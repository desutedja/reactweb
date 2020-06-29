import { createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';

export const slice = createSlice({
  name: 'main',
  initialState: {
    alert: false,
    title: '',
    content: '',
    info: {
      color: 'primary',
      message: '',
    },
    confirmDelete: {
      modal: false,
      content: '',
      confirmed: () => {},
    },
  },
  reducers: {
    openAlert: (state, action) => {
      state.alert = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
    },
    closeAlert: (state) => {
      state.alert = false;
    },
    setInfoData: (state, action) => {
      state.info.type = action.payload.type;
      state.info.message = action.payload.message;
    },
    toggleDelete: (state, action) => {
      state.confirmDelete.modal = !state.confirmDelete.modal;
      state.confirmDelete.content = action.payload.content;
      state.confirmDelete.confirmed = action.payload.confirmed;
    },
  },
});

export const {
  openAlert,
  closeAlert,
  setInfoData,
  toggleDelete,
} = slice.actions;

export const setConfirmDelete = (content, confirmed = () => {}) => dispatch => {
  dispatch(toggleDelete({
    content: content,
    confirmed: confirmed,
  }))
}

export const setInfo = data => dispatch => {
  dispatch(setInfoData(data));

  setTimeout(() => dispatch(setInfoData({
    message: '',
  })), 10000);
}

const responseAlert = response => async dispatch => {
  if (response && response.status === 401) {
    dispatch(openAlert({
      title: 'Token Expired',
      content: "Your authentication token has expired. For your safety, please relogin.",
    }));
  } else if (response.data.error_message) {
    dispatch(openAlert({
      title: 'API Error',
      content: response?.data.error_message,
    }));
  } else return null
}

export const get = (
  link, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => (dispatch, getState) => {
  const { auth } = getState();

  Axios.get(link, {
    headers: auth.headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      dispatch(responseAlert(err.response));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const post = (
  link, data, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => (dispatch, getState) => {
  const { auth } = getState();

  Axios.post(link, data, {
    headers: auth.headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      dispatch(responseAlert(err.response));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const put = (
  link, data, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => (dispatch, getState) => {
  const { auth } = getState();

  Axios.put(link, data, {
    headers: auth.headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      dispatch(responseAlert(err.response));


      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const patch = (
  link, data, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => (dispatch, getState) => {
  const { auth } = getState();

  Axios.patch(link, data, {
    headers: auth.headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      dispatch(responseAlert(err.response));


      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const del = (
  link, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => (dispatch, getState) => {
  const { auth } = getState();

  Axios.delete(link, {
    headers: auth.headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      dispatch(responseAlert(err.response));


      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export default slice.reducer;
