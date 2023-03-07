import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Detail from "../components/Detail";
import Template from "../components/Template";

import { useParams, useHistory } from "react-router-dom";
import { get, setConfirmDelete } from "../../slice";
import Pill from "../../../components/Pill";
import Table from "../../../components/Table";
import TableRating from "../../../components/TableRating";
import Task from "../../../components/cells/Task";
import {
  dateTimeFormatter,
  toSentenceCase,
  staffRoleFormatter,
  setModuleAccess,
  dateTimeFormatterCell,
} from "../../../utils";
import { endpointManagement, taskStatusColor } from "../../../settings";
import { deleteStaff, setSelected } from "../../slices/staff";
import { setAccess } from "../../auth/slice";
import Button from "../../../components/Button";
import Filter from "../../../components/Filter";


const stats = [
  { label: "Created", value: "created" },
  { label: "Assigned", value: "assigned" },
  { label: "In Progress", value: "in_progress" },
  { label: "Canceled", value: "canceled" },
  { label: "Reported", value: "reported" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
];



const columnsDepartments = [
  { Header: "ID", accessor: (row) => row.id },
  { Header: "Department Name", accessor: "department_name" },
  {
    Header: "Department Type",
    accessor: (row) => toSentenceCase(row.department_type),
  },
];

const columnsRatings = [ 
  {
    Header: "Created On",
    accessor: (row) => dateTimeFormatterCell(row.created_on),
  },
  {
    Header: "ID",
    accessor: (row) => (
      <Task
        id={row.id}
        data={row}
        items={[<small>{row.ref_code}</small>, row.unit_number ? <small>From unit: <b>{row.unit_number}</b></small> : []]}
      />
    ),
  },
  {
    Header: "Task",
    accessor: (row) =>
      row.description ? row.description : "-",
  },
  {
    Header: "Status",
    accessor: (row) =>
      row.status ? (
        <Pill color={taskStatusColor[row.status]}>
          {toSentenceCase(row.status) +
            (row.status === "created" && row.priority === "emergency"
              ? ":Searching for Security"
              : "") +
            (row.status === "rejected" ? " by " + row.rejected_by : "")}
        </Pill>
      ) : (
        "-"
      ),
  },
  {
    Header: "Task Duration",
    accessor: (row) =>
      row.time_duration ? row.time_duration : "-",
  },
];

function Component({ view, canUpdate, canDelete }) {
  const { auth } = useSelector((state) => state);
  const [data, setData] = useState({});
  const [dataTotal, setDataTotal] = useState({});
  const [datatasks, setDataTasks] = useState({});
  const [stat, setStat] = useState("");
  const [statName, setStatName] = useState("");
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();
  let { id } = useParams();
  let history = useHistory();

  const details = useMemo(() => {
    return {
      Profile: ["created_on", "gender", "nationality", "marital_status"],
      Address: ["address", "district_name", "city_name", "province_name"],
      "Availability Status": [
        {
          disabled: data.staff_role === "courier",
          label: "current_shift_status",
          vfmt: (v) =>
            data.staff_role === "gm_bm" || data.staff_role === "pic_bm" ? (
              <Pill color="success">Always</Pill>
            ) : v ? (
              <Pill color="success">On Shift</Pill>
            ) : (
              <Pill color="secondary">No</Pill>
            ),
        },
        {
          disabled: data.staff_role === "courier",
          label: "on_shift_until",
          lfmt: () =>
            !data.current_shift_status
              ? "Last Shift Ended At"
              : "On Shift Until",
          vfmt: (v) => (v ? dateTimeFormatter(v) : "-"),
        },
        {
          disabled: data.staff_role !== "courier",
          label: "is_available",
          lfmt: () => "Accepting Order",
          vfmt: (v) => (
            <Pill color={v ? "success" : "secondary"}>{v ? "Yes" : "No"}</Pill>
          ),
        },
      ],
      Management: [
        "management_name",
        { label: "staff_id", lfmt: () => "Identity No" },
        {
          label: "staff_role",
          lfmt: () => "Staff Role",
          vfmt: (v) => staffRoleFormatter(v),
        },
        {
          disabled: data.staff_role !== "Technician",
          label: "staff_specialization",
          lfmt: () => "Specialization",
          vfmt: (v) => (v ? toSentenceCase(v) : "-"),
        },
      ],
      "Bank Account": ["account_name", "account_number", "account_bank"],
    };
  }, [data]);

  useEffect(() => {
    dispatch(
      get(endpointManagement + "/admin/staff/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        if (auth.user.id === res.data.data.id) {
          const { active_module_detail } = res.data.data;
          let access = setModuleAccess(active_module_detail);
          dispatch(setAccess(access));
        }
      })
    );
  }, [dispatch, id]);

  return (
    <Template
      image={data.photo || "placeholder"}
      title={data.firstname + " " + data.lastname}
      pagetitle="Staff Information"
      email={data.email}
      phone={data.phone}
      loading={!data.id}
      // labels={["Details", "Rating Staff"]}
      labels={["Details","Performance"]}
      contents={[
        <>
          <Detail
            view={view}
            data={data}
            editable={canUpdate}
            labels={details}
            onDelete={
              auth?.role && auth.role === "bm"
                ? auth.user.id === data.id
                  ? false
                  : !canDelete
                  ? null
                  : () =>
                      dispatch(
                        setConfirmDelete(
                          "Are you sure to delete this item?",
                          () => dispatch(deleteStaff(data, history))
                        )
                      )
                : () =>
                    dispatch(
                      setConfirmDelete(
                        "Are you sure to delete this item?",
                        () => dispatch(deleteStaff(data, history))
                      )
                    )
            }
          />
          <div
            style={{
              color: "grey",
              borderBottom: "1px solid silver",
              width: 200,
              marginBottom: 8,
              marginLeft: 4,
            }}
          >
            Departments
          </div>
          <Table
            expander={false}
            noSearch={true}
            pagination={false}
            columns={columnsDepartments}
            data={data.departments}
          />
        </>,
        <TableRating
          expander={false}
          noSearch={false}
          pagination={false}
          columns={columnsRatings}
          dataTotalTasks={dataTotal}
          data={datatasks?.items || []}
          filters={[
            {
              button: (
                <Button
                  key="Status: All"
                  label={stat ? statName : "Status: All"}
                  selected={stat}
                />
              ),
              hidex: stat === "",
              label: <p>Status: {stat ? <b>{statName}</b> : <b>All</b>}</p>,
              delete: () => {
                setStat("");
              },
              component: (toggleModal) => (
                <Filter
                  data={stats}
                  onClickAll={() => {
                    setStat("");
                    setStatName("");
                    toggleModal(false);
                  }}
                  onClick={(el) => {
                    setStat(el.value);
                    setStatName(el.label);
                    toggleModal(false);
                  }}
                />
              ),
            },
          ]}
          fetchData={useCallback(
            (search, periode, startDateTo, endDateTo) => {
              setLoading(true);
              dispatch(
                get(
                  endpointManagement +
                    "/admin/staff/performance/tasks/history" +
                    "?staff_id=" + id +
                    "&period=" + periode +
                    "&period_start="+ startDateTo +
                    "&period_end=" + endDateTo +
                    "&filter=" + stat +
                    "&search=" + search,
                  (res) => {
                    console.log(res.data.data);
                    //console.log(data.departments);
                    setDataTasks(res.data.data);
                    setLoading(false);
                    console.log("===========================")
                    dispatch(
                      get(
                        endpointManagement +
                          "/admin/staff/performance/tasks/total" +
                          "?staff_id=" + id +
                          "&period=" + periode +
                          "&period_start="+ startDateTo +
                          "&period_end=" + endDateTo +
                          "&filter=" + stat +
                          "&search=" + search,
                        (res2) => {
                          console.log(res2.data.data);
                          setDataTotal(res2.data.data)
                        },
                      )
                    );
                  },
                )
              );
            },
            [dispatch, id, stat]
          )}
        />,
      ]}
    />
  );
}

export default Component;
