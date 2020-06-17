import { createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';
import history from '../history';

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
  },
});

export const {
  openAlert,
  closeAlert,
  setInfoData,
} = slice.actions;

export const setInfo = data => dispatch => {
  dispatch(setInfoData(data));

  setTimeout(() => dispatch(setInfoData({
    message: '',
  })), 3000);
}

export const get = (
  link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => dispatch => {
  Axios.get(link, {
    headers: headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      if (err.response && err.response.status === 401) {
        history.push('/login');
        window.location.reload();
      }

      dispatch(openAlert({
        title: 'An error has occured.',
        content: err.response?.data.error_message,
      }));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const post = (
  link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => dispatch => {
  Axios.post(link, data, {
    headers: headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      if (err.response && err.response.status === 401) {
        history.push('/login');
        window.location.reload();
      }

      dispatch(openAlert({
        title: 'An error has occured.',
        content: err.response?.data.error_message,
      }));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const put = (
  link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => dispatch => {
  Axios.put(link, data, {
    headers: headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      if (err.response && err.response.status === 401) {
        history.push('/login');
        window.location.reload();
      }

      dispatch(openAlert({
        title: 'An error has occured.',
        content: err.response?.data.error_message,
      }));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const patch = (
  link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => dispatch => {
  Axios.patch(link, data, {
    headers: headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      if (err.response && err.response.status === 401) {
        history.push('/login');
        window.location.reload();
      }

      dispatch(openAlert({
        title: 'An error has occured.',
        content: err.response?.data.error_message,
      }));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export const del = (
  link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) => dispatch => {
  Axios.delete(link, {
    headers: headers
  })
    .then(res => {
      console.log(res);

      ifSuccess(res);
    })
    .catch(err => {
      console.log(err);

      if (err.response && err.response.status === 401) {
        history.push('/login');
        window.location.reload();
      }

      dispatch(openAlert({
        title: 'An error has occured.',
        content: err.response?.data.error_message,
      }));

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export default slice.reducer;
