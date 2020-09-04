import { createSlice } from '@reduxjs/toolkit';
import { post } from '../slice';
import { endpointAdmin } from '../../settings';

export const slice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    role: '',
    group: '',
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

export const login = (role, email, actionState) => dispatch => {
  dispatch(startAsync());

  dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
    + '/validate_user', {
    user_account: email,
  }, res => {
    const { setStep, setUserId, setEmailUser } = actionState
    dispatch(loginSuccess(email));
    dispatch(setRole(role));

    setStep && setStep(2);
    setUserId && setUserId(res.data.data.id);
    setEmailUser && setEmailUser(res.data.data.email);
  }, (err) => {
    console.log('GAGAL LOGIN', err);
    dispatch(stopAsync());
  }))
}

export const otpCheck = (role, email, otp, history) => dispatch => {
  dispatch(startAsync());

  dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
    + '/otp', {
    "email": email,
    "otp": otp,
    "device": "web",
    "fcm_id": "",
  }, res => {
    dispatch(setRole(role));
    dispatch(otpSuccess({...res.data.data, role: role}));

    history && history.push("/" + role);
  }, () => {
    dispatch(stopAsync());
  }, () => {

  }))
}

export const sendOtp = (role, userId, method, email, history) => dispatch => {
  dispatch(startAsync());
  dispatch(post(endpointAdmin + '/auth/' + (role === 'sa' ? 'centratama' : 'management')
    + '/send_otp', {
    user_id: Number(userId),
    method
  }, res => {
    dispatch(stopAsync());
    history && history.push("/" + role + "/otp", {method, userId, email});
  }, (err) => {
    dispatch(stopAsync());
    console.log("Failed", err);
  }, () => {
  }))
}

export default slice.reducer;
