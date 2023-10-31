import { createSlice } from "@reduxjs/toolkit";
import { post } from "../slice";
import { endpointGlobal } from "../../settings";
import moment from "moment";

export const slice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    role: "",
    group: "",
    loading: false,
    email: "",
    user: {},
    headers: {},
    access: {},
    relogin: false,
    timeExpired: "",
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
      
      state.headers = {
        Authorization: "Bearer " + action.payload.token,
        "X-User-Id": action.payload.id,
        "X-Session": action.payload.session,
        "X-User-Type": action.payload.user_role,
        "Content-Type": "application/json",
      };
    },
    otpSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;

      state.user = action.payload.data;
      state.headers = {
        Authorization: "Bearer " + action.payload.data.token,
        "X-User-Id": action.payload.data.id,
        "X-Session": action.payload.data.session,
        "X-User-Type": action.payload.data.user_level,
        "Content-Type": "application/json",
      };
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setAccess: (state, action) => {
      state.access = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.access = {};
    },
    setRelogin: (state) => {
      state.relogin = true;
    },
    setLoginExpired: (state, action) => {
      state.timeExpired = action.payload
    }
  },
});

export const {
  startAsync,
  stopAsync,
  loginSuccess,
  otpSuccess,
  setRole,
  setAccess,
  logout,
  setRelogin,
  setLoginExpired,
} = slice.actions;

export const login = (role, username, password, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointGlobal + "/user/login",
      {
        username: username,
        password: password
      },
      (res) => {
        dispatch(setRole(role));
        dispatch(otpSuccess({ ...res.data, role: role }));
        dispatch(setRelogin());
        var timenow = moment().add(res.data.data.session, 's').toDate()
        dispatch(setLoginExpired(timenow));
        console.log("TIMENOW: ",timenow);
        history && history.push("/" + role);
        setTimeout(
          function(){
            dispatch(logout());
          },
          3500000 // 1000 = 1second
        );
      },
      (err) => {
        console.log("GAGAL LOGIN", err);
        dispatch(stopAsync());
      }
    )
  );
};


export default slice.reducer;
