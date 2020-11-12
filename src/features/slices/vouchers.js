import { createSlice } from "@reduxjs/toolkit";
import { endpointAdmin } from "../../settings";
import { get, post, del, patch, setInfo } from "../slice";

const voucherEndpoint = endpointAdmin + "/centratama/vouchers";

export const slice = createSlice({
  name: "vouchers",
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

export const getVoucher = (
  pageIndex,
  pageSize,
  search = "",
  type,
  category
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      voucherEndpoint +
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

export const getVoucherDetails = (row, history, url) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      voucherEndpoint + "/" + row.id,
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

export const createVoucher = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      voucherEndpoint,
      data,
      (res) => {
        history.push("/sa/vouchers");

        dispatch(
          setInfo({
            color: "success",
            message: "Vouchers has been created.",
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

export const editVoucher = (data, history, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    patch(
      voucherEndpoint,
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

export const deleteVoucher = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      voucherEndpoint + "?id=" + row.id,
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
