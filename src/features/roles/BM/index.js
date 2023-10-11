import React, { useEffect, useState } from "react";
import {
  FiZap,
  FiPlus,
} from "react-icons/fi";
import { Redirect, Route } from "react-router-dom";

import Template from "../components/Template";
import Button from "../../../components/Button";
import Table from "../../../components/Table";
import ModalDepartment from "../../../features/settings/Department";
import Tab from "../../../components/Tab";
import { useSelector, useDispatch } from "react-redux";

import { endpointAdmin, endpointManagement } from "../../../settings";
import { get, del, setInfo, setConfirmDelete } from "../../slice";
import { logout, setRelogin } from "../../auth/slice";


import Billing from "./Billing";
import { toSentenceCase } from "../../../utils";

const columns = [
  { Header: "ID", accessor: (row) => row.id },
  { Header: "Department Name", accessor: "department_name" },
  {
    Header: "Department Type",
    accessor: (row) => toSentenceCase(row.department_type),
  },
];

const modules = [
  {
    icon: <FiZap className="MenuItem-icon" />,
    label: "Billing",
    path: "/billing",
    subpaths: ["/unit"],
    component: <Billing />,
  },
];

const labels = {
  Information: [
    "id",
    "created_on",
    "legal_name",
    "owner_name",
    "code_name",
    "email",
  ],
  Address: [
    "address",
    "district_name",
    "city_name",
    "province_name",
    "zipcode",
  ],
  Others: ["max_units", "max_floors", "max_sections"],
};
const picBmLabels = {
  Fees: ["billing_published", "billing_duedate", "penalty_fee"],
};
const autoAssignLabel = {
  Auto_Assign: [
    "auto_assign",
    "auto_assign_limit",
    "auto_assign_schedule",
    "auto_assign_schedule_day",
  ],
};
const autoAnswerLabel = {
  Auto_Answer: [
    "auto_answer",
    "auto_answer_from",
    "auto_answer_text",
    "auto_answer_image",
  ],
};

export default () => {
  const dispatch = useDispatch();
  const { auth, building } = useSelector((state) => state);
  const id = auth.user.building_id;
  const { blacklist_modules } = useSelector((state) => state.auth.user);
  const activeModuleAccess = useSelector((state) => state.auth.access);
  const [departments, setDepartments] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [data, setData] = useState({});
  const [dataBM, setDataBM] = useState({});
  const [menus, setMenus] = useState(modules || []);
  const [loading, setLoading] = useState(false);
  const [modalDepartment, setModalDepartment] = useState(false);
  const [departmentData, setDepartmentData] = useState({});
  const [title, setTitle] = useState("");
  const [picBmList, setPicBmList] = useState([]);

  const toggle = () => {
    setRefresh(!refresh);
  };

  console.log("ACTIVE MODULE ACCESS===",activeModuleAccess)

  useEffect(() => {
    console.log("sudah logout kah anda?", auth.relogin);
    if (!auth.relogin) {
      dispatch(setRelogin());
      dispatch(logout());
    }
    dispatch(
      get(endpointAdmin + "/management/building?page=1&limit=9999", (res) => {
        const formatted = res.data.data.items.map((el) => ({
          label:
            "BM ID " +
            el.id +
            " (" +
            el.building_name +
            " - " +
            el.management_name +
            ")",
          value: el.id,
        }));
        setPicBmList(formatted);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(
      get(endpointManagement + "/admin/department", (res) => {
        setDepartments(res.data.data || []);
        setLoading(false);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    const modulesLabel = blacklist_modules?.map((module) => module.module);
    if (typeof activeModuleAccess.mapped === "undefined") {
      return null;
    }
    const dashboardMenu = activeModuleAccess.mapped.dashboard;
    const normalMenu = activeModuleAccess.mapped.normal;
    const modulesFilter = menus.filter((menu) => {
      if (menu.path == "/dashboard") {
        if (dashboardMenu.length === 0) {
          return false;
        }
        return true;
      }

      const truthy = normalMenu?.some(
        (moduleAcc) => moduleAcc.path === menu.path
      );
      return truthy;
    });
    const filteredModule = [];
    modulesFilter.map((item) => {
      if (item.path === "/dashboard" && typeof item.subpaths !== "undefined") {
        if (item.subpaths.length > 0) {
          item.subpaths = item.subpaths.filter((el) => {
            const truthy = dashboardMenu?.some(
              (moduleAcc) => moduleAcc.subpath === el
            );
            return truthy;
          });
        }
      }
      filteredModule.push(item);
    });
    setMenus(filteredModule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModuleAccess]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management/building/details/" +
          auth.user.building_management_id,
        (res) => {
          setDataBM(res.data.data);
        },
        (err) => {
          console.log("ERR", err);
        }
      )
    );
  }, [auth.user.building_management_id, dispatch, building.refreshToggle]);

  useEffect(() => {
    if (!modalDepartment) setDepartmentData({});
  }, [modalDepartment]);

  return (
    <Template role="bm">
      <Redirect exact from={"/bm"} to={"/bm" + menus[0].path} />
      {menus.map((el) => (
        <Route
          key={el.label}
          label={el.label}
          icon={el.icon}
          path={"/bm" + el.path}
          subpaths={el.subpaths}
        >
          {el.component}
        </Route>
      ))}
      <Route path={"/bm/settings"}>
        <div className="Container flex-column pr-3">
          <Tab
            labels={["Departments"]}
            contents={[
              <>
                <ModalDepartment
                  title={title}
                  toggleRefresh={toggle}
                  modal={modalDepartment}
                  toggleModal={() => setModalDepartment(false)}
                  toggleLoading={setLoading}
                  data={departmentData}
                  picBmList={picBmList}
                />
                <Table
                  expander={false}
                  noSearch={true}
                  pagination={false}
                  columns={columns}
                  loading={loading}
                  data={departments}
                  onClickDelete={(row) => {
                    dispatch(
                      setConfirmDelete(
                        "Are you sure to delete this item?",
                        () => {
                          setLoading(true);
                          dispatch(
                            del(
                              endpointManagement +
                                "/admin/department/" +
                                row.id,
                              (res) => {
                                dispatch(
                                  setInfo({
                                    color: "success",
                                    message: "Item has been deleted.",
                                  })
                                );
                                setLoading(false);
                                setRefresh(!refresh);
                              }
                            )
                          );
                        }
                      )
                    );
                  }}
                  onClickEdit={(row) => {
                    setDepartmentData(row);
                    setModalDepartment(true);
                    setTitle("Edit Department");
                  }}
                  renderActions={() => [
                    <Button
                      key="Add Department"
                      label="Add Department"
                      icon={<FiPlus />}
                      onClick={() => {
                        setModalDepartment(true);
                        setTitle("Add Department");
                      }}
                    />,
                  ]}
                />
              </>,
            ]}
          />
        </div>
      </Route>
    </Template>
  );
};