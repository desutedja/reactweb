import { createSlice } from "@reduxjs/toolkit";
import { endpointBilling } from "../../settings";
import { get, post, put, del, getFile } from "../slice";
import { setInfo, setInfoSetAsPaid } from "../slice";

const billingEndpoint = endpointBilling + "/management/billing";

export const slice = createSlice({
  name: "billing",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    selectedItem: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    unit: {
      items: [],
      selected: {},
      total_items: 0,
      total_pages: 1,
    },
    settlement: {
      items: [],
      selected: {},
      total_items: 0,
      total_pages: 1,
    },
    disbursement: {
      items: [],
      selected: {},
      total_items: 0,
      total_pages: 1,
    },
    selectedRowIds: [],
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
      state.total_pages = data.filtered_page;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    refresh: (state) => {
      state.refreshToggle = !state.refreshToggle;
    },
    setUnit: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
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
    setPublishBilling: (state, action) => {
      const data = action.payload;
      state.selectedRowIds = data;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setUnit,
  setSettlement,
  setDisbursement,
  setSelectedItem,
  setPublishBilling,
} = slice.actions;

export default slice.reducer;

export const getBillingUnit =
  (
    pageIndex,
    pageSize,
    search = "",
    startDate,
    endDate,
    building,
    released = ""
  ) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        billingEndpoint +
          "/unit" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&building_id=" +
          building +
          "&search=" +
          search +
          "&startDate=" +
          startDate +
          "&endDate=" +
          endDate +
          "&released=" +
          released,

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

export const getBillingUnitSetAsPaid =
  (page, pageSize, searchItem = "", month, year, status, unitid) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        endpointBilling +
          "/management/billing/unit/groupv3/details" +
          "?page=" +
          (page + 1) +
          "&limit=" +
          pageSize +
          "&month=" +
          month +
          "&year=" +
          year +
          "&unit_id=" +
          unitid +
          "&payment=" +
          status +
          "&search=" +
          searchItem,

        (res) => {
          // console.log(res);
          dispatch(setData(res.data.data));

          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

export const downloadBillingUnit =
  (search = "", building) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      getFile(
        billingEndpoint + "/unit/download" + "?building_id=" + building,
        "billing_unit.csv",
        (res) => {
          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

export const downloadSetAsPaidBulk =
  (fileUpload, building, downloadfile) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      getFile(
        endpointBilling +
          "/management/billing/setaspaidbulk?building_id=" +
          building,
        downloadfile + ".csv",
        (res) => {
          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

export const getBillingSettlement =
  (pageIndex, pageSize, search = "", building, settled, start = "", end = "") =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        billingEndpoint +
          "/settlement/v2" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&building_id=" +
          building +
          "&payment_settled=" +
          settled +
          "&sort_field=created_on&sort_type=DESC" +
          "&date_min=" +
          start +
          "&date_max=" +
          end +
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

export const downloadBillingSettlement =
  (search = "", building = "", status = "", dateMin = "", dateMax = "") =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      getFile(
        billingEndpoint +
          "/settlement/v2" +
          "?building_id=" +
          building +
          "&payment_settled=" +
          status +
          "&date_min=" +
          dateMin +
          "&date_max=" +
          dateMax +
          "&search=" +
          search +
          "&export=true&page=1&limit=99999999",
        "billing_settlement.csv",
        (res) => {
          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

export const getBillingDisbursement =
  (pageIndex, pageSize, search = "", filter = "") =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        billingEndpoint +
          "/disbursement/list/management" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&sort_field=created_on&sort_type=DESC" +
          "&search=" +
          search +
          "&filter=" +
          filter,

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

export const getBillingUnitDetails = (row, history, url) => (dispatch) => {
  dispatch(setSelected(row));
  history.push(url + "/item");
};

export const getBillingUnitItem =
  (pageIndex, pageSize, search = "", selected, status) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        billingEndpoint +
          "/unit/group" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&unit_id=" +
          selected.id +
          "&building_id=" +
          selected.building_id +
          // '&sort_field=created_on&sort_type=DESC' +
          "&search=" +
          search,

        (res) => {
          dispatch(setUnit(res.data.data));

          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

// V1
export const createBillingUnitItem =
  (data, selected, history, role) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      post(
        billingEndpoint,
        data,
        (res) => {
          const _res = res.data.data;
          history.push(
            "/" + role + "/billing/unit/" + _res.resident_unit + "/" + _res.id
          );

          dispatch(
            setInfo({
              color: "success",
              message: "Billing has been created.",
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

export const editBillingUnitItem =
  (data, selectedItem, history, role) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      put(
        billingEndpoint,
        { ...data, id: selectedItem.id },
        (res) => {
          const _res = res.data.data;
          history.push(
            "/" + role + "/billing/unit/" + _res.resident_unit + "/" + _res.id
          );

          dispatch(
            setInfo({
              color: "success",
              message: "Billing has been updated.",
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

export const deleteBillingUnitItem =
  (id, unitid, history, role) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      del(
        billingEndpoint + "/" + id,
        (res) => {
          history.push("/" + role + "/billing/unit/" + unitid);

          dispatch(
            setInfo({
              color: "success",
              message: "Billing has been deleted.",
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

export const payByCash = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      billingEndpoint + "/cash",
      data,
      (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: "Billing has been set as paid by cash.",
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

export const updateSetAsPaidSelected = (data) => (dispatch) => {
  dispatch(startAsync());
  dispatch(
    post(
      billingEndpoint + "/set_as_paid",
        data,
      (res) => {
        dispatch(refresh());
        dispatch(stopAsync());

        const body = res.data.data;
        console.log(body.data_paid.length);
        
        if (body.data_paid.length != 0 && body.error_message == null) {
          dispatch(
            setInfo({
              color: "success",
              message: `Selected billing(s) has been set to paid.`,
            })
          );

        } else if (body.data_paid.length != 0 && body.error_message.length != 0){
          dispatch(
            setInfo({
              color: "danger",
              message: `Some selected billing has been set to paid and some cant be set as paid.`,
            })
          );
          
        }else {
          dispatch(
            setInfo({
              color: "danger",
              message: `Selected billing(s) cant be set to paid. No data found or billing is already Paid`,
            })
          );

        } 
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const updateSetAsPaidSelectedDetail = (id, billing_items) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      billingEndpoint + "/set_as_paid_detail",
        {billing_items: id},
        (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: `Selected billing has been set to paid.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(
          setInfo({
            color: "error",
            message: `Error to set as paid billing.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      }
    )
  );
};

export const releaseSelectedBillingDetail = (id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      billingEndpoint + "/publish_item",
        {billing_item: id},
        (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: `Selected billing has been published.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(
          setInfo({
            color: "error",
            message: `Error to set as paid billing.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      }
    )
  );
};

export const deleteBillingDetail = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      billingEndpoint + "/" + row.id,
        (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: `Billing has been deleted.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(
          setInfo({
            color: "error",
            message: `Billing can't be deleted.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      }
    )
  );
};

// export const deleteBillingDetail = (row, history) => (dispatch, getState) => {
//   dispatch(startAsync());

//   const { auth } = getState();

//   dispatch(
//     del(
//       billingEndpoint + '/' + row.id,
//       row.id,
//       (res) => {
//         history && history.push("/" + auth.role + "/billing/unit/" + row.resident_unit);

//         dispatch(refresh());

//         dispatch(
//           setInfo({
//             color: "danger",
//             message: "Billing has been deleted.",
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

export const getBillingCategory =
  (pageIndex, pageSize, search = "", building, unit) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        billingEndpoint +
          "/unit/category" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&sort_field=created_on&sort_type=DESC" +
          "&building_id=" +
          building +
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

export const downloadBillingCategory =
  (search = "", building) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      getFile(
        billingEndpoint +
          "/unit/category" +
          "?search=" +
          search +
          "&resident_building=" +
          building +
          "&export=true&limit=999999999999",
        "billing_category.csv",
        (res) => {
          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

export const updateBillingPublish = (ids, selectWithImage, schedule) => (dispatch) => {
  dispatch(startAsync());
  dispatch(
    post(
      billingEndpoint + "/publish-billing",
      {
        data: ids,
        schedule_publish: schedule,
        with_image: selectWithImage,
      },
      (res) => {
        dispatch(
          setInfo({
            color: "success",
            message: `${res.data.data} billing has been set to released.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(
          setInfo({
            color: "error",
            message: `Error to released.`,
          })
        );

        dispatch(refresh());
        dispatch(stopAsync());
      }
    )
  );
};


