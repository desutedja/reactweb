import { createSlice } from "@reduxjs/toolkit";
import { endpointResident } from "../../settings";
import { get, post, del, put,patch, setInfo } from "../slice";

const residentEndpoint = endpointResident + "/management/resident";

export const slice = createSlice({
  name: "requestpremium",
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

export const getRequestPremium = (
  pageIndex,
  pageSize,
  search = "",
  approved_status = "",
  building,
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      residentEndpoint +
        "/get_basicuser/v2" +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize +
        "&search=" +
        search +
        "&approved_status=" +
        approved_status +
        "&sort_field=created_on&sort_type=DESC" + 
        "&building_id=" +
        building,
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


export const editResident = (data, history, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      residentEndpoint + "/edit",
      { ...data, id: id },
      (res) => {
        dispatch(setSelected(res.data.data));
        history.push(`${id}`);

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been edited.",
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

export const approvedResident = (row, history, periodFrom, periodTo) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      residentEndpoint + "/upgrade_user",
      { approved_status:"approved", id: row.id, resident_id : parseInt(row.resident_id), period_from: periodFrom, period_to: periodTo },
      (res) => {
        history && history.push("/get_basicuser");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been Approved.",
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

export const disapprovedResident = (row, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      residentEndpoint + "/upgrade_user",
      { approved_status:"disapprove", id: row.id, resident_id : parseInt(row.resident_id)},
      (res) => {
        history && history.push("/get_basicuser");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been Disapprove.",
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

export default slice.reducer;
