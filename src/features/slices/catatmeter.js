import { createSlice } from "@reduxjs/toolkit";
import { endpointManagement } from "../../settings";
import { get, post, del, put,patch, setInfo, getFile } from "../slice";

const managementEndpoint = endpointManagement + "/admin/meter";

export const slice = createSlice({
  name: "catatmeter",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
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

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
} = slice.actions;

export const getCatatmeter = (
  pageIndex,
  pageSize,
  search = "",
  building,
  month,
  year,
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      managementEndpoint +
        "/list/v2" +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize +
        "&search=" +
        search +
        "&building=" +
        building +
        "&month="+
        month+
        "&year="+
        year+
        "&sort_field=created_on&sort_type=DESC&export=false",
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

export const downloadCatatMeter = (
  search,
  building,
  year,
  month,
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    getFile(
      managementEndpoint +
        "/list" +
        "?page=1" +
        "&limit=10000" +
        "&search=" +
        search +
        "&building=" +
        building +
        "&year="+
        year +
        "&month="+
        month +
        "&sort_field=created_on&sort_type=DESC&export=true",
        "catat_meter.csv",
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};


export default slice.reducer;
