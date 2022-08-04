import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Detail from "../components/Detail";
import Template from "../components/Template";

import { useParams, useHistory } from "react-router-dom";
import { get, setConfirmDelete } from "../../slice";
import Pill from "../../../components/Pill";
import Table from "../../../components/Table";
import TableRating from "../../../components/TableRating";
import {
  dateTimeFormatter,
  toSentenceCase,
  staffRoleFormatter,
  setModuleAccess,
} from "../../../utils";
import { endpointManagement } from "../../../settings";
import { deleteStaff, setSelected } from "../../slices/staff";
import { setAccess } from "../../auth/slice";
import { FaStar } from "react-icons/fa";
import Avatar from "react-avatar";

const columnsDepartments = [
  { Header: "ID", accessor: (row) => row.id },
  { Header: "Department Name", accessor: "department_name" },
  {
    Header: "Department Type",
    accessor: (row) => toSentenceCase(row.department_type),
  },
];

const columnsRatings = [
  { Header: "Resident", accessor: (row) =>
    <>
      <div className="Item">
        <Avatar className="Item-avatar" size="40" src={""}
          name={"Dadang Jordan"} round />
        <div >
            <b>{"Dadang Jordan"}</b>
            <p className="Item-subtext">{"dadangjodan#1@djordan.ay"}</p>
        </div> 
      </div>
    </>
  },
  { Header: "Rating", accessor: (row) => 
    <>
      <FaStar color={'#FFCE2A'} style={{ marginRight: 2 }} />
      <FaStar color={'#FFCE2A'} style={{ marginRight: 2 }} />
      <FaStar color={'#FFCE2A'} style={{ marginRight: 2 }} />
      <FaStar color={'#FFCE2A'} style={{ marginRight: 2 }} />
      <FaStar color={'#FFCE2A'} style={{ marginRight: 2 }} />
    </>
  },
  {
    Header: "Department Type",
    accessor: (row) => "Ulasan Resident",
  },
];

function Component({ view, canUpdate, canDelete }) {
  const { auth } = useSelector((state) => state);
  const [data, setData] = useState({});

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
      email={data.email}
      phone={data.phone}
      loading={!data.id}
      labels={["Details", "Rating Staff"]}
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
          noSearch={true}
          pagination={false}
          columns={columnsRatings}
          data={data.departments}
        />
      ]}
    />
  );
}

export default Component;
