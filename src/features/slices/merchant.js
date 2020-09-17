import { createSlice } from "@reduxjs/toolkit";
import { endpointMerchant } from "../../settings";
import { get, post, del, patch, setInfo } from "../slice";

const merchantEndpoint = endpointMerchant + "/admin";

export const slice = createSlice({
  name: "merchant",
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
      state.total_items = data.total_items;
      state.total_pages = data.total_pages;
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

export default slice.reducer;

export const getMerchant = (
  pageIndex,
  pageSize,
  search = "",
  type,
  category
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      merchantEndpoint +
        "/list" +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize +
        "&type=" +
        type +
        "&category=" +
        category +
        "&sort_field=created_on&sort_type=DESC" +
        "&search=" +
        search,

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

export const getMerchantDetails = (row, history, url) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      merchantEndpoint + "?id=" + row.id,
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

export const createMerchant = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      merchantEndpoint,
      data,
      (res) => {
        history.push("/sa/merchant");

        dispatch(
          setInfo({
            color: "success",
            message: "Merchant has been created.",
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

export const editMerchant = (data, history, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    patch(
      merchantEndpoint,
      { ...data, id: id },
      (res) => {
        dispatch(setSelected(res.data.data));
        history.push("/sa/merchant/" + id);

        dispatch(
          setInfo({
            color: "success",
            message: "Merchant has been updated.",
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

export const deleteMerchant = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      merchantEndpoint + "?id=" + row.id,
      (res) => {
        history && history.push("/" + auth.role + "/merchant");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Merchant has been deleted.",
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
