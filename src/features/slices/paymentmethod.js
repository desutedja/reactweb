import { createSlice } from "@reduxjs/toolkit";
import { endpointAdmin } from "../../settings";
import { get, post, del, patch, setInfo, put } from "../slice";

const paymentEndpoint = endpointAdmin + "/building";

export const slice = createSlice({
  name: "method",
  initialState: {
    loading: false,
    items: [],
    selected: {},
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

// export const getPaymentMethod = (
//   startdate ="",
//   enddate ="",
//   buildingid ="",
//   bank ="",
// ) => (dispatch) => {
//   dispatch(startAsync());

//   dispatch(
//     get(
//       paymentEndpoint +
//         "/getpaymentchannel?status=all" +
//         "&start_date=" +
//         startdate +
//         "&end_date=" +
//         enddate + 
//         "&building_id=" + 
//         buildingid +
//         "&bank=" +
//         bank,

//       (res) => {
//         dispatch(setData(res.data.data));

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };

// export const getVoucherDetails = (row, history, url) => (dispatch) => {
//   dispatch(startAsync());

//   dispatch(
//     get(
//       voucherEndpoint + "/" + row.id,
//       (res) => {
//         dispatch(setSelected(res.data.data));
//         history.push(url + "/details");

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };

export const createVA = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointAdmin + '/paymentperbuilding',
      data,
      (res) => {
        history.push("/sa/promo VA");

        dispatch(
          setInfo({
            color: "success",
            message: "Promo VA has been created.",
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

export const editVA = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      endpointAdmin + '/paymentperbuilding',
      data,
      (res) => {
        history.push("/sa/promo VA");

        dispatch(
          setInfo({
            color: "success",
            message: "Promo VA has been updated.",
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

export const deleteVA = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
        endpointAdmin +
          "/paymentperbuilding",
          row.id,
      (res) => {
        history && history.push("/" + auth.role + "/Promo VA");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Promo has been deleted.",
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

// export const editVoucher = (data, history, id) => (dispatch) => {
//   dispatch(startAsync());

//   dispatch(
//     patch(
//       voucherEndpoint,
//       { ...data, id: id },
//       (res) => {
//         dispatch(setSelected(res.data.data));
//         history.push("/sa/merchant/" + id);

//         dispatch(
//           setInfo({
//             color: "success",
//             message: "Merchant has been updated.",
//           })
//         );

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };

// export const deleteVoucher = (row, history) => (dispatch, getState) => {
//   dispatch(startAsync());

//   const { auth } = getState();

//   dispatch(
//     del(
//       voucherEndpoint + "?id=" + row.id,
//       (res) => {
//         history && history.push("/" + auth.role + "/merchant");

//         dispatch(refresh());

//         dispatch(
//           setInfo({
//             color: "success",
//             message: "Merchant has been deleted.",
//           })
//         );

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };

// export const distributeVoucher = (id, voucherId, history) => (
//   dispatch,
//   getState
// ) => {
//   dispatch(startAsync());

//   const { auth } = getState();

//   dispatch(
//     patch(
//       voucherEndpoint + "/distribute/" + id,
//       (res) => {
//         history && history.push("/" + auth.role + "/vouchers/" + voucherId);
//         dispatch(refresh());

//         dispatch(
//           setInfo({
//             color: "success",
//             message: "Merchant has been deleted.",
//           })
//         );

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };
