import { createSlice } from "@reduxjs/toolkit";
import { endpointTask } from "../../settings";
import { get, post, setInfo, getFile } from "../slice";

const taskEndpoint = endpointTask + "/admin";

export const slice = createSlice({
  name: "task",
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
  delegate,
} = slice.actions;

export const downloadTasks = (
  pageIndex,
  pageSize,
  search = "",
  type,
  prio,
  status,
  building,
  unit,
  createdStart = "",
  createdEnd = "",
  resolvedStart = "",
  resolvedEnd = "",
  exportCsv="true"
  ) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    getFile(
      taskEndpoint +
      "/list/download" +
      "?page=" +
      pageIndex +
      "&limit=" +
      pageSize +
      "&search=" +
      search +
      //'&sort_field=created_on' +
      "&sort_type=DESC" +
      "&type=" +
      type +
      "&priority=" +
      prio +
      "&requester_building_id=" +
      building +
      "&requester_unit_id=" +
      unit +
      "&sort_field=created_on" +
      "&created_start_date=" +
      createdStart +
      "T00:00:00" +
      "&created_end_date=" +
      createdEnd +
      "T23:59:59" +
      "&resolved_start_date=" +
      "&resolved_end_date=" +
      "&status=" +
      status +
      "&export=" +
      exportCsv,
      "tasks.csv",
      (res) => {
        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getTask = (
  pageIndex,
  pageSize,
  search = "",
  type,
  prio,
  status,
  building,
  unit,
  createdStart = "",
  createdEnd = "",
  resolvedStart = "",
  resolvedEnd = ""
) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      taskEndpoint +
        "/list" +
        "?page=" +
        (pageIndex + 1) +
        "&limit=" +
        pageSize +
        "&search=" +
        search +
        //'&sort_field=created_on' +
        "&sort_type=DESC" +
        "&type=" +
        type +
        "&priority=" +
        prio +
        "&requester_building_id=" +
        building +
        "&requester_unit_id=" +
        unit +
        "&sort_field=created_on" +
        "&created_start_date=" +
        createdStart +
        "T00:00:00" +
        "&created_end_date=" +
        createdEnd +
        "T23:59:59" +
        "&resolved_start_date=" +
        (resolvedStart ? resolvedStart + "T00:00:00" : "") +
        "&resolved_end_date=" +
        (resolvedEnd ? resolvedEnd + "T23:59:59" : "") +
        "&status=" +
        status,

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

export const resolveTask = (data) => (dispatch) => {
  dispatch(startAsync());

  const ids = data.map((el) => el.id);

  dispatch(
    post(
      taskEndpoint + "/resolve?id=" + ids,
      {},
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        const body = res.data.data;
        var message, color;

        if (!body.valid_ids || body.valid_ids === []) {
          if (data.length === 1) {
            message =
              "Error: Task could not be marked as resolved. Reason: " +
              body.reasons.map((el) => el);
            color = "danger";
          } else {
            message =
              "Error: Could not mark all tasks as resolved. Reasons: " +
              body.reasons.map((el) => el).join(" / ");
            color = "danger";
          }
        } else if (body.valid_ids.length > 0) {
          if (body.valid_ids.length === data.length) {
            if (data.length === 1) {
              message = "Tasks have been marked as resolved.";
            } else {
              message =
                body.valid_ids.length + " tasks have been marked as resolved.";
            }
            color = "success";
          } else if (body.valid_ids.length < data.length) {
            message =
              body.valid_ids.length +
              " tasks have been marked as resolved, " +
              body.invalid_ids.length +
              " was not marked as resolved";
            color = "warning";
          } else {
            // nothing
          }
        }

        dispatch(setInfo({ message: message, color: color }));
        setTimeout(() => dispatch(setInfo({ message: "" })), 5000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

// Helper Section
export const acceptAssignHelper = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/add_helper",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Helper request for task " +
              data.task_id +
              " has been assigned",
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const rejectHelper = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/reject_helper",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Assigning helper to this Task " +
              data.task_id +
              " has been Rejected ",
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

// End Helper Section

// Delegate Section
export const delegateTask = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/delegate",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Task " +
              data.task_id +
              " has been delegated to staff id " +
              data.assignee_id,
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const rejectDelegate = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/reject_delegate",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Delegate Request Task " +
              data.task_id +
              " has been Rejected ",
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

// export const rejectDelegate = (data) => (dispatch) => {
//   dispatch(startAsync());
  
//   dispatch(
//     post(
//       taskEndpoint + "/delegate",  { id: data.id },
//       res => {
//         dispatch(refresh());
//         dispatch(setInfo({
//           color: 'success',
//           message: 'Delegate Request Rejected'
//         }));
  
//         dispatch(stopAsync());
//       },
//       err => {
//         dispatch(stopAsync());
//       })
//   );
// };

// End of Delegate Section

export const reassignTask = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/assign",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Task " +
              data.task_id +
              " has been reassigned to staff id " +
              data.assignee_id,
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const addReportAttachment = (data) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    post(
      taskEndpoint + "/report/create",
      data,
      (res) => {
        dispatch(stopAsync());
        dispatch(refresh());

        dispatch(
          setInfo({
            message:
              "Report has been succesfully add for task with id" +
              data.task_id,
          })
        );
        setTimeout(() => dispatch(setInfo({ message: "" })), 3000);
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export const getTaskDetails = (row, history) => (dispatch) => {
  dispatch(startAsync());

  dispatch(
    get(
      taskEndpoint + "/" + row.id,
      (res) => {
        dispatch(setSelected(res.data.data));

        dispatch(stopAsync());
      },
      (err) => {
        dispatch(stopAsync());
      }
    )
  );
};

export default slice.reducer;
