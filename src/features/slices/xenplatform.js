import { createSlice } from "@reduxjs/toolkit";
import { endpointBilling } from "../../settings";
import { post, get, del, put, patch } from "../slice";
import { setInfo } from "../slice";

const buildingXenplatofrm = endpointBilling + "/management/billing/unit/xenplatform";

export const slice = createSlice({
  name: "xenplatform",
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
    unit_type: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    section: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    service: {
      items: [],
      total_items: 0,
      total_pages: 1,
      page: 1,
      range: 10,
    },
    management: {
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
    setUnitData: (state, action) => {
      const data = action.payload;

      state.unit.items = data.items;
      state.unit.total_items = data.filtered_item;
      state.unit.total_pages = data.filtered_page;
    },
    setUnitTypeData: (state, action) => {
      const data = action.payload;

      state.unit_type.items = data.items;
      state.unit_type.total_items = data.filtered_item;
      state.unit_type.total_pages = data.filtered_page;
    },
    setSectionData: (state, action) => {
      const data = action.payload;

      state.section.items = data.items;
      state.section.total_items = data.filtered_item;
      state.section.total_pages = data.filtered_page;
    },
    setServiceData: (state, action) => {
      const data = action.payload;

      state.service.items = data.items;
      state.service.total_items = data.filtered_item;
      state.service.total_pages = data.filtered_page;
    },
    setManagementData: (state, action) => {
      const data = action.payload;

      state.management.items = data.items;
      state.management.total_items = data.filtered_item;
      state.management.total_pages = data.filtered_page;
    },
  },
});

export const {
  startAsync,
  stopAsync,
  setData,
  setSelected,
  refresh,
  setUnitData,
  setUnitTypeData,
  setSectionData,
  setServiceData,
  setManagementData,
} = slice.actions;

export const getBuilding = (
  pageIndex,
  pageSize,
 
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize ,

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

export const createBuilding = (data, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm,
      data,
      (res) => {
        history.push("/sa/building");

        dispatch(
          setInfo({
            color: "success",
            message: "Building has been created.",
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

export const editBuilding = (data, history, id, role) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm,
      { ...data, id: id },
      (res) => {
        dispatch(setSelected(res.data.data));
        console.log(history);
        role === "bm"
          ? history && history.push("/" + role + "/settings")
          : history && history.push(`${id}`);

        dispatch(
          setInfo({
            color: "success",
            message: "Building has been updated.",
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

export const deleteBuilding = (row, history) => (dispatch, getState) => {
  dispatch(startAsync());

  const { auth } = getState();

  dispatch(
    del(
      buildingXenplatofrm + "/" + row.id,
      (res) => {
        history && history.push("/" + auth.role + "/building");

        dispatch(
          setInfo({
            color: "success",
            message: "Building has been deleted.",
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

export const getBuildingDetails = (row, history, url) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm + "/details/" + row.id,
      (res) => {
        dispatch(setSelected(res.data.data));
        history.push(url + "/" + res.data.data.id);

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getBuildingUnit = (
  pageIndex,
  pageSize,
  search,
  row,
  hasResident = false
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "/unit" +
        "?page=" +
        (pageIndex + 1) +
        "&building_id=" +
        row.id +
        "&search=" +
        search +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize +
        (hasResident ? "&has_resident=true" : ""),

      (res) => {
        dispatch(setUnitData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getBuildingUnitType = (
  pageIndex,
  pageSize,
  search,
  row,
  unit_type = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "/unit/type" +
        "?page=" +
        (pageIndex + 1) +
        "&building_id=" +
        row.id +
        "&search=" +
        search +
        "&unit_type=" +
        unit_type +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize,

      (res) => {
        dispatch(setUnitTypeData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getBuildingSection = (
  pageIndex,
  pageSize,
  search,
  row,
  section_type = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "/section" +
        "?page=" +
        (pageIndex + 1) +
        "&building_id=" +
        row.id +
        "&section_type=" +
        section_type +
        "&search=" +
        search +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize,

      (res) => {
        dispatch(setSectionData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getBuildingService = (
  pageIndex,
  pageSize,
  search,
  row,
  group = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "/service" +
        "?page=" +
        (pageIndex + 1) +
        "&building_id=" +
        row.id +
        "&group=" +
        group +
        "&search=" +
        search +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize,

      (res) => {
        dispatch(setServiceData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getBuildingManagement = (pageIndex, pageSize, search, row) => (
  dispatch
) => {
  dispatch(startAsync());

  dispatch(
    get(
      buildingXenplatofrm +
        "/management" +
        "?page=" +
        (pageIndex + 1) +
        "&building_id=" +
        row.id +
        "&search=" +
        search +
        "&sort_field=created_on&sort_type=DESC" +
        "&limit=" +
        pageSize,

      (res) => {
        dispatch(setManagementData(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const changeBuildingManagement = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm + "/management/status",
      data,
      (res) => {
        dispatch(refresh());
        console.log(res.data);

        dispatch(
          setInfo({
            color: "success",
            message: "Management status has been changed.",
          })
        );

        // dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );

  dispatch(stopAsync());
};

export const createBuildingUnit = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm + "/unit",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit has been created.",
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

export const createBuildingUnitType = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm + "/unit/type",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit type has been created.",
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

export const createBuildingSection = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm + "/section",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building section has been created.",
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

export const createBuildingManagement = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      buildingXenplatofrm + "/management",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building management has been created.",
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

export const createBuildingService = (data) => (dispatch) => {
  dispatch(startAsync());

  // console.log(data)

  dispatch(
    post(
      buildingXenplatofrm + "/service",
      data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building service has been created.",
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

export const editBuildingUnit = (data, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm + "/unit",
      { ...data, id: id },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit has been updated.",
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

export const editBuildingUnitType = (data, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm + "/unit/type",
      { ...data, id: id },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit type has been updated.",
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

export const editBuildingSection = (data, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm + "/section",
      { ...data, id: id },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building section has been updated.",
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

export const editBuildingManagement = (data, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm + "/management",
      { ...data, id: id },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building mangement has been updated.",
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

export const editBuildingService = (data, id) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    put(
      buildingXenplatofrm + "/service",
      { ...data, id: id },
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building service has been updated.",
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

export const deleteBuildingUnit = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      buildingXenplatofrm + "/unit/" + row.id,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit has been deleted.",
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

export const deleteBuildingUnitType = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      buildingXenplatofrm + "/unit/type/" + row.id,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building unit type has been deleted.",
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

export const deleteBuildingSection = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      buildingXenplatofrm + "/section/" + row.id,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building section has been deleted.",
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

export const deleteBuildingManagement = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      buildingXenplatofrm + "/management/" + row.id,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building management has been deleted.",
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

export const deleteBuildingService = (row) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    del(
      buildingXenplatofrm + "/service/" + row.id,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Building service has been deleted.",
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

export const deleteMultipleBuilding = (row, history) => (dispatch) => {
  dispatch(startAsync());

  const data = row.map((el) => "building_id=" + el).join("&");

  dispatch(
    del(
      buildingXenplatofrm + "?" + data,
      (res) => {
        dispatch(refresh());

        dispatch(
          setInfo({
            color: "success",
            message: "Buildings have been deleted.",
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
