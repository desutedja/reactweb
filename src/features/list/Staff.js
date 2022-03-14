import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";

import { toSentenceCase } from "../../utils";
import { endpointAdmin, endpointManagement } from "../../settings";
import { FiSearch } from "react-icons/fi";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Pill from "../../components/Pill";
import Staff from "../../components/cells/Staff";
import { getStaff, setSelected } from "../slices/staff";
import { get } from "../slice";

import Template from "./components/Template";

const ListDepartment = ({ data }) => {
  const history = useHistory();
  const { role } = useSelector((state) => state.auth);
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      <button
        onClick={() => history.push("/" + role + "/staff/" + data.id)}
        className="ml-2"
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        See Departments
      </button>
      <div
        className={"list-modal-hover" + (modalHover ? " on" : "")}
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {data.departments.map((item, i) => (
          <div className="p-3">
            {i +
              1 +
              ". " +
              item.department_name +
              " (" +
              item.department_type +
              ")"}
          </div>
        ))}
      </div>
    </div>
  );
};

const columns = [
  {
    Header: "Staff",
    accessor: (row) => <Staff id={row.id} data={row} />,
  },
  {
    Header: "Email",
    accessor: (row) => <a href={"mailto:" + row.email}>{row.email}</a>,
  },
  { Header: "Building", accessor: "building_name" },
  {
    Header: "Management",
    accessor: "management_name",
  },
  {
    Header: "Departments",
    accessor: (row) =>
      row.departments.length > 0 ? (
        <ListDepartment data={row} />
      ) : (
        <center>-</center>
      ),
  },
  {
    Header: "Available",
    accessor: (row) =>
      row.staff_role === "courier" ? (
        row.is_available ? (
          <Pill color="success">Accepting Order</Pill>
        ) : (
          <Pill color="secondary">No</Pill>
        )
      ) : row.staff_role === "gm_bm" || row.staff_role === "pic_bm" ? (
        <Pill color="success">Always</Pill>
      ) : row.current_shift_status ? (
        <Pill color="success">On Shift</Pill>
      ) : (
        <Pill color="secondary">No</Pill>
      ),
  },
  {
    Header: "Status",
    accessor: (row) => (
      <Pill color={row.status === "active" ? "success" : "secondary"}>
        {toSentenceCase(row.status)}
      </Pill>
    ),
  },
];

const roles = [
  { label: "BM Manager", value: "gm_bm" },
  { label: "BM Admin", value: "pic_bm" },
  { label: "Service Staff", value: "technician" },
  { label: "Courier", value: "courier" },
  { label: "Security Staff", value: "security" },
];

const shifts = [
  { label: "Available", value: "yes" },
  { label: "Not Available", value: "no" },
];

function Component({ view, canAdd, canUpdate, canDelete }) {
  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  const { auth } = useSelector((state) => state);
  const [shift, setShift] = useState("");
  const [shiftLabel, setShiftLabel] = useState("");

  const [building, setBuilding] = useState("");
  const [buildings, setBuildings] = useState("");
  const [buildingLabel, setBuildingLabel] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState("");
  const [departmentType, setDepartmentType] = useState("");

  const [
    management,
    // setManagement
  ] = useState("");

  const [role, setRole] = useState(
    history.location.state ? history.location.state.role : ""
  );
  const [roleLabel, setRoleLabel] = useState(
    history.location.state ? history.location.state.roleLabel : ""
  );

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?limit=" +
            limit +
            "&page=1" +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            if (data.length < totalItems && search.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setBuildings(formatted);
          }
        )
      );
  }, [dispatch, search, limit]);

  useEffect(() => {
    building &&
      dispatch(
        get(
          endpointManagement +
            "/admin/department?bm_id=" +
            building +
            "&type=all" +
            "&limit=" +
            limit,
          (res) => {
            let data = res.data.data;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            const formatted = res.data.data.map((el) => ({
              label: toSentenceCase(el.department_name) + "( " + toSentenceCase(el.department_type) + ")",
              value: el.id,
            }));

            if (data.length < totalItems && search.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setDepartments(formatted);
          }
        )
      );
  }, [building, dispatch, limit]);

  useEffect(() => {
    if (auth.role === "bm") {
      const blacklist_modules = auth.user.blacklist_modules;
      const isSecurity = blacklist_modules.find(
        (item) => item.module === "security"
      )
        ? true
        : false;
      const isInternalCourier = blacklist_modules.find(
        (item) => item.module === "internal_courier"
      )
        ? true
        : false;
      const isTechnician = blacklist_modules.find(
        (item) => item.module === "technician"
      )
        ? true
        : false;

      if (isTechnician) delete roles[2];
      if (isInternalCourier) delete roles[3];
      if (isSecurity) delete roles[4];
    }
  }, [auth]);

  return (
    <Template
      view={view}
      columns={columns}
      slice="staff"
      getAction={getStaff}
      filterVars={[role, building, shift, management, department]}
      filters={[
        ...(building
          ? [
              {
                hidex: department === "",
                label: "Department: ",
                value: department ? departmentType : "All",
                delete: () => {
                  setDepartment("");
                },
                component: (toggleModal) => (
                  <>
                    <Filter
                      data={departments}
                      onClick={(el) => {
                        if (!el.value) {
                          setLimit(limit + el.restTotal);
                          return;
                        }
                        setDepartment(el.value);
                        setDepartmentType(el.label);
                        setLimit(5);
                        toggleModal(false);
                      }}
                      onClickAll={() => {
                        setDepartment("");
                        setLimit(5);
                        toggleModal(false);
                      }}
                    />
                    {/* {unitSearch ? 'Showing at most 10 matching units' : 
                              'Showing 10 most recent units'} */}
                  </>
                ),
              },
            ]
          : []),
        {
          hidex: building === "",
          label: "Building: ",
          value: building ? buildingLabel : "All",
          delete: () => {
            setBuilding("");
            setDepartment("");
          },
          component: (toggleModal) => (
            <>
              <Input
                label="Search Building"
                compact
                icon={<FiSearch />}
                inputValue={search}
                setInputValue={setSearch}
              />
              <Filter
                data={buildings}
                onClick={(el) => {
                  if (!el.value) {
                    setLimit(limit + el.restTotal);
                    return;
                  }
                  setBuilding(el.value);
                  setBuildingLabel(el.label);
                  setDepartment("");
                  setLimit(5);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setBuilding("");
                  setBuildingLabel("");
                  setDepartment("");
                  setLimit(5);
                  toggleModal(false);
                }}
              />
            </>
          ),
        },
        {
          hidex: shift === "",
          label: (
            <p>
              {shiftLabel ? "Availability: " + shiftLabel : "Availability: All"}
            </p>
          ),
          delete: () => {
            setShift("");
            setShiftLabel("");
          },
          component: (toggleModal) => (
            <Filter
              data={shifts}
              onClick={(el) => {
                setShift(el.value);
                setShiftLabel(el.label);
                toggleModal(false);
              }}
              onClickAll={() => {
                setShift("");
                setShiftLabel("");
                toggleModal(false);
              }}
            />
          ),
        },
        {
          hidex: role === "",
          label: <p>{role ? "Role: " + roleLabel : "Role: All"}</p>,
          delete: () => {
            setRole("");
            setRoleLabel("");
          },
          component: (toggleModal) => (
            <Filter
              data={roles}
              onClickAll={() => {
                setRole("");
                setRoleLabel("");
                toggleModal(false);
              }}
              onClick={(el) => {
                setRole(el.value);
                setRoleLabel(el.label);
                toggleModal(false);
              }}
            />
          ),
        },
      ]}
      actions={
        view
          ? null
          : (auth.role === "bm" ? !canAdd : false)
          ? null
          : [
              <Button
                key="Add Staff"
                label="Add Staff"
                icon={<FiPlus />}
                onClick={() => {
                  dispatch(setSelected({}));
                  history.push(url + "/add");
                }}
              />,
            ]
      }
      // deleteAction={deleteStaff}
    />
  );
}

export default Component;
