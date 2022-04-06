import {
  createSlice
} from "@reduxjs/toolkit";
import {
  endpointTransaction
} from "../../settings";
import {
  get,
  post,
  getFile,
  setInfo
} from "../slice";

import moment from "moment";
const transactionEndpoint = endpointTransaction + "/admin/transaction";

export const slice = createSlice({
  name: "transaction",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    refreshToggle: true,
    settlement: {
      items: [],
      selected: {},
      total_items: 0,
      total_pages: 1,
    },
    disbursement: {
      items: {
        data: [],
      },
      selected: {},
      total_items: 0,
      total_pages: 1,
    },
    completed: {
      success: false,
      message: "",
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
    setSettlement: (state, action) => {
      const data = action.payload;

      state.settlement.items = data.items;
      state.settlement.total_items = data.filtered_item;
      state.settlement.total_pages = data.filtered_page;
    },
    setDisbursement: (state, action) => {
      const data = action.payload;

      state.disbursement.items = data.items;
      state.disbursement.total_items = data.filtered_item;
      state.disbursement.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setCompletedTransaction: (state, action) => {
      state.completed = action.payload;
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
  setSettlement,
  setSelected,
  setDisbursement,
  setCompletedTransaction,
  refresh,
} = slice.actions;

export default slice.reducer;

export const getTransaction = (
  pageIndex,
  pageSize,
  search = "",
  status = "",
  statusPayment = "",
  type = "",
  start,
  end
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      transactionEndpoint +
      "/list" +
      "?page=" +
      (pageIndex + 1) +
      "&limit=" +
      pageSize +
      "&status=" +
      status +
      "&payment_status=" +
      statusPayment +
      "&trx_type=" +
      type +
      "&sort_field=created_on&sort_type=DESC" +
      "&start_date=" +
      start +
      "T00:00:00" +
      "&end_date=" +
      end +
      "T23:59:59" +
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

export const downloadTransaction = (
  status = "",
  statusPayment = "",
  type = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    getFile(
      transactionEndpoint +
      "/list" +
      "?status=" +
      status +
      "&payment_status=" +
      statusPayment +
      "&trx_type=" +
      type +
      "&sort_field=created_on" +
      "&sort_type=DESC" +
      "&export=true",
      "transaction_list.csv",
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getTransactionDetails = (trx_code, history, url) => (dispatch) => {
  url = "/sa/transaction";

  dispatch(startAsync());

  dispatch(
    get(
      transactionEndpoint + "/" + trx_code,
      (res) => {
        dispatch(setSelected(res.data.data));
        history.push(url + "/" + trx_code);

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getTransactionSettlement = (
  pageIndex,
  pageSize,
  search = "",
  settlementStatus = "",
  start,
  end
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      transactionEndpoint +
      "/list" +
      "?page=" +
      (pageIndex + 1) +
      "&limit=" +
      pageSize +
      "&settlement_status=" +
      settlementStatus +
      "&status=completed" +
      "&sort_field=created_on&sort_type=DESC" +
      "&settlement_start_date=" +
      start +
      "T00:00:00" +
      "&settlement_end_date=" +
      end +
      "T23:59:59" +
      "&search=" +
      search,

      (res) => {
        dispatch(setSettlement(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const downloadTransactionSettlement = (
    settlementStatus = "",
    start,
    end
  ) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    getFile(
      transactionEndpoint +
      "/list" +
      "?page=1" +
      "&limit=10" +
      "&settlement_status=" +
      settlementStatus +
      "&status=completed" +
      "&sort_field=created_on&sort_type=DESC" +
      "&settlement_start_date=" +
      start +
      "T00:00:00" +
      "&settlement_end_date=" +
      end +
      "T23:59:59" +
      "&search=" +
      "&export=true",
      "transaction_settlement.csv",
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getTransactionDisbursement = (
  pageIndex,
  pageSize,
  search = "",
  type,
  merchant = "",
  courier = "",
  disbursementStatus = "",
  start,
  end,
  s_start,
  s_end
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      endpointTransaction +
      "/admin/disbursement/" +
      type +
      "?page=" +
      (pageIndex + 1) +
      "&limit=" +
      pageSize +
      (type === "merchant" ?
        "&merchant_id=" + merchant :
        "&courier_id=" + courier) +
      "&limit=" +
      pageSize +
      "&sort_field=created_on&sort_type=DESC" +
      "&search=" +
      search +
      "&disbursement_status=" +
      disbursementStatus +
      "&disbursed_start_date=" +
      start +
      "T00:00:00" +
      "&disbursed_end_date=" +
      end +
      "T23:59:59" +
      "&settlement_start_date=" +
      s_start +
      "T00:00:00" +
      "&settlement_end_date=" +
      s_end +
      "T23:59:59",
      (res) => {
        dispatch(setDisbursement(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const downloadTransactionDisbursement = (
  type,
  merchant = "",
  courier = ""
) => (dispatch) => {
  dispatch(startAsync());
  const now = moment().format(`DDMMyyyy${parseInt(Math.random()*100000)}`)
  dispatch(
    getFile(
      endpointTransaction +
      "/admin/disbursement/" +
      type +
      "?merchant_id=" +
      merchant +
      "&courier_id=" +
      courier +
      "&export=true",
      `disbursement-${now.toString()}.xlsx`,
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const completedTransaction = (data) => (dispatch) => {
  dispatch(startAsync());
  dispatch(refresh());

  dispatch(
    post(
      transactionEndpoint + "/complete",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        var message, color;
        const body = res.data.data;

        if (!body.valid_ids || body.valid_ids === []) {
          if (data.length === 1) {
            message =
              "Error: Transaction cannot be completed. Reason: " +
              body.reasons.map((el) => el);
            color = "danger";
          } else {
            message =
              "Error: Could not mark all transaction as completed. Reasons: " +
              body.reasons.map((el) => el).join(" / ");
            color = "danger";
          }
        } else if (body.valid_ids.length > 0) {
          if (body.valid_ids.length === data.length) {
            if (data.length === 1) {
              message = "Transaction have been marked as completed.";
            } else {
              message =
                body.valid_ids.length +
                " transactions have been marked as completed.";
            }
            color = "success";
          } else if (body.valid_ids.length < data.length) {
            message =
              body.valid_ids.length +
              " transaction have been marked as completed, " +
              body.invalid_ids.length +
              " was not marked as completed";
            color = "warning";
          } else {
            // nothing
          }
        }

        dispatch(setInfo({
          message: message,
          color: color
        }));
        setTimeout(() => dispatch(setInfo({
          message: ""
        })), 5000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};