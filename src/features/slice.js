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
  })), 10000);
}

const responseAlert = response => async dispatch => {
  if (response && response.status === 401) {
    dispatch(openAlert({
      title: 'Token Expired',
      content: "Your authentication token has expired. For your safety, please relogin.",
    }));
  } else {
    dispatch(openAlert({
      title: 'API Error',
      content: response?.data.error_message,
    }));
  }
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

      dispatch(responseAlert(err.response));

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

      dispatch(responseAlert(err.response));

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

      dispatch(responseAlert(err.response));


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

      dispatch(responseAlert(err.response));


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

      dispatch(responseAlert(err.response));


      ifError(err);
    })
    .finally(() => {
      finallyDo();
    })
}

export default slice.reducer;
