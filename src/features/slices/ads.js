import { createSlice } from "@reduxjs/toolkit";

import { endpointAds } from "../../settings";
import moment from "moment";
import { get, post, put, del, patch, getFile } from "../slice";
import { setInfo } from "../slice";

const adsEndpoint = endpointAds + "/management/ads";

export const slice = createSlice({
  name: "ads",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    schedule: {
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
    setScheduleData: (state, action) => {
      const data = action.payload;

      state.schedule.items = data.items;
      state.schedule.total_items = data.filtered_item;
      state.schedule.total_pages = data.filtered_page;
    },
    publish: (state) => {
      state.selected.published = 1;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setScheduleData,
  publish,
} = slice.actions;

export const getAds = (
  pageIndex,
  pageSize,
  search = "",
  sortField,
  sortType,
  os = "",
  gender = "",
  age_from = "",
  age_to = "",
  day = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      adsEndpoint +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize +
        "&search=" +
        search +
        "&sort_field=" +
        sortField +
        "&sort_type=" +
        sortType +
        "&age_from=" +
        age_from +
        "&age_to=" +
        age_to +
        "&os=" +
        os +
        "&gender=" +
        gender +
        "&day=" +
        day,

      (res) => {
        dispatch(setData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const createAds = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    post(
      adsEndpoint,
      data,
      (res) => {
        history.push("/" + auth.role + "/advertisement");

        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement has been created.",
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

export const downloadAdsReport = (selectedId, selectedType) => (dispatch) => {
  dispatch(startAsync());
  const now = moment().format(`DDMMyyyy${parseInt(Math.random() * 100000)}`);
  let userID = "";
  let adsID = "";
  if (selectedType === "advertiser") {
    userID = selectedId;
  } else if (selectedType === "campaign") {
    adsID = selectedId;
  }
  const url =
    endpointAds +
    "/management/ads/report?export=true&user_id=" +
    userID +
    "&ads_id=" +
    adsID;
  dispatch(
    getFile(
      url,
      `ads-report-${now.toString()}.xlsx`,
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const editAds = (data, history, id, role) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      adsEndpoint,
      data,
      (res) => {
        // dispatch(setSelected(res.data.data));
        history.push("/" + role + "/advertisement/" + id);

        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement has been updated.",
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

export const deleteAds = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      adsEndpoint + "/" + row.id,
      (res) => {
        history && history.push("/" + auth.role + "/advertisement");

        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement has been deleted.",
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getAdsDetails = (row, history, url) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      adsEndpoint + "/" + row.id,
      (res) => {
        dispatch(setSelected(res.data.data));
        history.push(url + "/details");

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getAdsSchedule = (pageIndex, pageSize, search, row) => (
  dispatch
) => {
  dispatch(startAsync());

  dispatch(
    get(
      adsEndpoint +
        "/schedule/" +
        row.id +
        "?page=" +
        (pageIndex + 1) +
        "&search=" +
        search +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize,

      (res) => {
        dispatch(setScheduleData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const createAdsSchedule = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      adsEndpoint + "/schedule",
      data,
      (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement schedule has been added.",
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const editAdsSchedule = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    patch(
      adsEndpoint + "/schedule",
      data,
      (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement schedule has been added.",
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const deleteAdsSchedule = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      adsEndpoint + "/schedule/" + row.int,
      (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement schedule has been deleted.",
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const publishAds = (data, callback) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      adsEndpoint + "/change_status",
      { advertisement_id: data.id, status: "publish" },
      (res) => {
        dispatch(publish());

        dispatch(
          setInfo({
            color: "success",
            message: "Advertisement published.",
          })
        );

        dispatch(stopAsync());
        callback();
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export default slice.reducer;
