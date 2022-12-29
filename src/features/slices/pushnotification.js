import { createSlice } from "@reduxjs/toolkit";
import { endpointNotification } from "../../settings";
import { get, post, put, del, setInfo, getFile, patch } from "../slice";

const notificationEndpoint = endpointNotification + "/admin";

export const slice = createSlice({
  name: "pushnotification",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    pushnotification: {
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

export const { startAsync, stopAsync, setData, setSelected, refresh } =
  slice.actions;

export default slice.reducer;

export const createPushNotif = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    post(
      endpointNotification + "/pushnotif",
      data,
      (res) => {
        history && history.push("/" + auth.role + "/push notification");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "New Push Notification has been created.",
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

export const editPushNotif = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    put(
      endpointNotification + "/pushnotif",
      data,
      (res) => {
        history && history.push("/" + auth.role + "/push notification");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Push Notificatio has been updated.",
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

export const deletePushNotif = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      endpointNotification + "/pushnotif/" + row.id,

      // endpointNotification + "/pushnotif",
      row.id,
      (res) => {
        history && history.push("/" + auth.role + "/push notification");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "danger",
            message: "Push Notification has been deleted.",
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

export const activatePushNotif = (id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      endpointNotification + "/pushnotif/status",
      {id, is_active: true},
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Push notification has ben set to active.",
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

export const inActivatePushNotif = (id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      endpointNotification + "/pushnotif/status",
      {id, is_active: false},
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Push notification has ben set to inactive.",
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