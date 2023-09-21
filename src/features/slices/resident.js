import { createSlice } from "@reduxjs/toolkit";
import { endpointResident } from "../../settings";
import { get, post, del, put, setInfo } from "../slice";

const residentEndpoint = endpointResident + "/management/resident";

export const slice = createSlice({
  name: "resident",
  initialState: {
    loading: false,
    items: [],
    selected: {},
    total_items: 0,
    total_pages: 1,
    page: 1,
    range: 10,
    refreshToggle: true,
    unit: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    subaccount: {
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
      state.total_items = data.total_items;
      state.total_pages = data.total_pages;
    },
    // V1
    // setUnitData: (state, action) => {
    //   const data = action.payload;

    //   state.unit.items = data.items;
    //   state.unit.total_items = data.filtered_item;
    //   state.unit.total_pages = data.filtered_page;
    // },

    // V2
    setUnitData: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.total_item;
      state.unit.total_pages = data.total_page;
    },
    setSubaccountData: (state, action) => {
      const data = action.payload;

      state.subaccount.items = data.items;
      state.subaccount.total_items = data.filtered_item;
      state.subaccount.total_pages = data.filtered_page;
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
  setUnitData,
  setSubaccountData,
  setSelected,
  refresh,
} = slice.actions;

export const getResident =
  (
    pageIndex,
    pageSize,
    search = search,
    status = "",
    kyc = kyc,
    online = "",
    onboarding = "",
    building ="",
    residentType="",
  ) =>
  (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        residentEndpoint +
          "/read/v2" +
          "?page=" +
          (pageIndex + 1) +
          "&limit=" +
          pageSize +
          "&search=" +
          search +
          "&kyc=" +
          kyc +
          "&status=" +
          status +
          "&sort_field=created_on&sort_type=DESC" +
          "&online=" +
          online +
          "&onboarding=" +
          onboarding +
          "&building_id=" +
          building+
          "&resident_type="+
          residentType,
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

export const createResident = (data, history) => (dispatch, getState) => {
  dispatch(startAsync());

  dispatch(
    post(
      residentEndpoint + "/register/v2",
      data,
      (res) => {
        // history.push('/' + auth.role + "/resident");
        history.push(`${res.data.data.id}`);

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been created.",
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
            message: "Resident has been updated.",
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

export const deleteResident = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      residentEndpoint + "/delete/v3/" + row.id,
      (res) => {
        history && history.push("/" + auth.role + "/resident");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been deleted.",
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

export const residentReturnToBasic = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      residentEndpoint + "/delete/" + row.id,
      (res) => {
        history && history.push("/" + auth.role + "/resident");

        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident has been deleted.",
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

export const getResidentDetails = (row, history, url) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      residentEndpoint + "/detail/" + row.id,
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

export const getSubaccount =
  (pageIndex, pageSize, search, id) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        residentEndpoint +
          "/subaccount" +
          "?page=" +
          (pageIndex + 1) +
          "&id=" +
          id +
          "&limit=" +
          pageSize +
          "&sort_field=created_on&sort_type=DESC" +
          "&search=" +
          search,

        (res) => {
          dispatch(setSubaccountData(res.data.data));
          console.log("->", res);

          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

// V1
export const getResidentUnit =
  (pageIndex, pageSize, search, id) => (dispatch) => {
    dispatch(startAsync());

    dispatch(
      get(
        residentEndpoint +
          "/unitv2" +
          "?page=" +
          (pageIndex + 1) +
          "&id=" +
          id +
          "&limit=" +
          pageSize +
          "&sort_field=created_on&sort_type=DESC" +
          "&search=" +
          search,

        (res) => {
          console.log(res.data.data);
          dispatch(setUnitData(res.data.data));

          dispatch(stopAsync());
        },
        (err) => {
          dispatch(stopAsync());
        }
      )
    );
  };

// V2
// export const getResidentUnit =
// (pageIndex, pageSize, search, id) => (dispatch) => {
//   dispatch(startAsync());

//   dispatch(
//     get(
//       residentEndpoint +
//         "/unitv2" +
//         "?page=" +
//         (pageIndex + 1) +
//         "&id=" +
//         id +
//         "&limit=" +
//         pageSize +
//         "&sort_field=created_on&sort_type=DESC" +
//         "&search=" +
//         search,

//       (res) => {
//         console.log(res.data.data);
//         dispatch(setUnitData(res.data.data));

//         dispatch(stopAsync());
//       },
//       (err) => {
//         dispatch(stopAsync());
//       }
//     )
//   );
// };
   
export const addResidentUnit = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      residentEndpoint + "/add_unit",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident unit has been created.",
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

export const addSubaccount = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      residentEndpoint + "/add_unit",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident subaccount has been created.",
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

export const deleteUnit = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      residentEndpoint + "/delete_unit_sub",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident unit has been deleted.",
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

export const deleteSubaccount = (unit, parent, owner) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      residentEndpoint + "/delete_unit_sub",
      {
        delete: [
          {
            unit_id: unit,
            owner_id: owner,
          },
        ],
      },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Resident subaacount has been deleted.",
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
