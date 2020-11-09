import { createSlice } from "@reduxjs/toolkit";
import { post } from "../slice";
import { endpointAdmin } from "../../settings";
import { setModuleAccess, toSentenceCase } from "../../utils";

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
        Authorization: "Bearer " + action.payload.token,
        "X-User-Id": action.payload.id,
        "X-Session": action.payload.session,
        "X-User-Type": action.payload.role,
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
} = slice.actions;

export const login = (role, email, actionState) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointAdmin +
        "/auth/" +
        (role === "sa" ? "centratama" : "management") +
        "/validate_user",
      {
        user_account: email,
      },
      (res) => {
        const { setStep, setUserId, setEmailUser } = actionState;
        dispatch(loginSuccess(email));
        dispatch(setRole(role));

        setStep && setStep(2);
        setUserId && setUserId(res.data.data.id);
        setEmailUser && setEmailUser(res.data.data.email);
      },
      (err) => {
        console.log("GAGAL LOGIN", err);
        dispatch(stopAsync());
      }
    )
  );
};

export const otpCheck = (role, email, otp, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointAdmin +
        "/auth/" +
        (role === "sa" ? "centratama" : "management") +
        "/otp",
      {
        email: email,
        otp: otp,
        device: "web",
        fcm_id: "",
      },
      (res) => {
        dispatch(setRole(role));
        dispatch(otpSuccess({ ...res.data.data, role: role }));

        if (role === "bm") {
          dispatch(setAccess(access));
          const { active_module_detail } = res.data.data;
          let access = setModuleAccess(active_module_detail);
        }
        // const filteredActiveModule = active_module_detail.filter(
        //   (el) => el.access_type === "web"
        // );
        // const dashboardModule = [],
        //   nonDashboardModule = [];
        // const activeModule = filteredActiveModule?.map((mod) => {
        //   let type =
        //     mod.access.split("_")[0] === "dashboard"
        //       ? mod.access.split("_")[0]
        //       : "not_dashboard";
        //   let value =
        //     mod.access.split("_")[0] === "dashboard"
        //       ? mod.access.split("_")[1]
        //       : mod.access;
        //   let privilege = mod.access_privilege.split(",");
        //   let mods = {
        //     baseLabel: toSentenceCase(mod.access.replace("_", " ")),
        //     label: toSentenceCase(value),
        //     baseValue: mod.access,
        //     value,
        //     type,
        //     privilege,
        //   };
        //   if (type === "dashboard") {
        //     mods.path = `/${mods.type}`;
        //     mods.subpath = `/${mods.value}`;
        //     dashboardModule.push(mods);
        //   } else {
        //     mods.path = `/${mods.value}`;
        //     mods.subpath = ``;
        //     nonDashboardModule.push(mods);
        //   }
        //   return mods;
        // });
        // const access = {
        //   mapped: { dashboard: dashboardModule, normal: nonDashboardModule },
        //   unmapped: activeModule,
        // };
        history && history.push("/" + role);
      },
      () => {
        dispatch(stopAsync());
      },
      () => {}
    )
  );
};

export const sendOtp = (role, userId, method, email, history) => (dispatch) => {
  dispatch(startAsync());
  dispatch(
    post(
      endpointAdmin +
        "/auth/" +
        (role === "sa" ? "centratama" : "management") +
        "/send_otp",
      {
        user_id: Number(userId),
        method,
      },
      (res) => {
        dispatch(stopAsync());
        history && history.push("/" + role + "/otp", { method, userId, email });
      },
      (err) => {
        dispatch(stopAsync());
        console.log("Failed", err);
      },
      () => {}
    )
  );
};

export default slice.reducer;
