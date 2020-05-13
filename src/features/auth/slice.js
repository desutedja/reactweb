import { createSlice } from '@reduxjs/toolkit';
import { post } from '../../utils';
import { endpointAdmin } from '../../settings';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    loading: false,
    email: '',
    user: {},
    headers: {}
  },
  reducers: {
    startAsync: (state) => {
      state.loading = true;
    },
    stopAsync: (state) => {
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.email = action.payload;
    },
    otpSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;

      state.user = action.payload;
      state.headers = {
        'Authorization': 'Bearer ' + action.payload.token,
        'X-User-Id': action.payload.id,
        'X-Session': action.payload.session,
        'X-User-Type': 'sa',
        'Content-Type': 'application/json',
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
    }
  },
});

export const {
  startAsync,
  stopAsync,
  loginSuccess,
  otpSuccess,
  logout
} = slice.actions;

export const login = (email, history) => dispatch => {
  dispatch(startAsync());

  post(endpointAdmin + '/auth/centratama/login', {
    email: email,
  }, {}, res => {
    dispatch(loginSuccess(email));

    history && history.push("/otp");
  }, () => {
    dispatch(stopAsync());
  })
}

export const otpCheck = (email, otp, history) => dispatch => {
  console.log(email);

  post(endpointAdmin + '/auth/centratama/otp', {
    "email": email,
    "otp": otp,
    "device": "web",
    "fcm_id": ""
  }, {}, res => {
    dispatch(otpSuccess(res.data.data));

    history.push("/");
  }, () => {
    dispatch(stopAsync());
  }, () => {

  })
}

export default slice.reducer;
