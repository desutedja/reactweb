import { createSlice } from '@reduxjs/toolkit';
import { post } from '../slice';
import { endpointAdmin } from '../../settings';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    role: '',
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
        'X-User-Type': action.payload.role,
        'Content-Type': 'application/json',
      }
    },
    setRole: (state, action) => {
      state.role = action.payload;
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
  setRole,
  logout
} = slice.actions;

export const login = (role, email, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
    + '/login', {
    email: email,
  }, res => {
    dispatch(loginSuccess(email));

    history && history.push("/" + role + "/otp");
  }, () => {
    dispatch(stopAsync());
  }))
}

export const otpCheck = (role, email, otp, history) => dispatch => {
  console.log(email);

  dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
    + '/otp', {
    "email": email,
    "otp": otp,
    "device": "web",
    "fcm_id": "1:10663666241:web:f3a844afac4e2025a6dcc0"
  }, res => {
    dispatch(setRole(role));
    dispatch(otpSuccess({...res.data.data, role: role}));

    history.push("/" + role);
  }, () => {
    dispatch(stopAsync());
  }, () => {

  }))
}

export default slice.reducer;
