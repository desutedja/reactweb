import { createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';
import history from '../history';

export const slice = createSlice({
  name: 'main',
  initialState: {
    alert: false,
    title: '',
    content: '',
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
  },
});

export const {
  openAlert,
  closeAlert
} = slice.actions;

export function get(
  link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
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

      alert(err.response?.data.error_message);

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

export function put(
  link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
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

      alert(err.response?.data.error_message);

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export function patch(
  link, data, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
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

      alert(err.response?.data.error_message);

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export function del(
  link, headers, ifSuccess = () => { }, ifError = () => { }, finallyDo = () => { }
) {
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

      alert(err.response?.data.error_message);

      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export default slice.reducer;
