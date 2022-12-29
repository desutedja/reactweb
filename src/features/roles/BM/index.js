import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiUsers,
  FiZap,
  FiVolume2,
  FiBarChart2,
  FiPlus,
  FiUserCheck,
} from "react-icons/fi";
import {
  RiTaskLine,
  RiBuilding2Line,
  RiCustomerService2Line,
  RiAdvertisementLine,
  RiSurveyLine,
  RiFileTextLine,
} from "react-icons/ri";
import parser from "html-react-parser";
import { Redirect, Route, useHistory, Link } from "react-router-dom";

import Template from "../components/Template";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Table from "../../../components/Table";
import ModalDepartment from "../../../features/settings/Department";
import Tab from "../../../components/Tab";
import { useSelector, useDispatch } from "react-redux";
import AutoAnswer from "../../form/AutoAnswer";

import { endpointAdmin, endpointManagement } from "../../../settings";
import { get, del, setInfo, setConfirmDelete } from "../../slice";
import {
  setSelected,
  editBuildingManagement,
  editBuilding,
} from "../../slices/building";
import { logout, setRelogin } from "../../auth/slice";

import Dashboard from "./Dashboard";
import Ads from "./Ads";
import Announcement from "./Announcement";
import Billing from "./Billing";
import Building from "./Building";
import Resident from "./Resident";
import RequestPremium from "./RequestPremium";
import CatatMeter from "./CatatMeter";
import Staff from "./Staff";
import Task from "./Task";
import Details from "../../details/components/Detail";
import Chat from "../../chat";
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
    icon: <FiBarChart2 className="MenuItem-icon" />,
    label: "Dashboard",
    path: "/dashboard",
    // subpaths: ["/building", "/task", "/advertisement", "/CCTV"],
    subpaths: ["/building", "/task", "/advertisement"],
    component: <Dashboard />,
  },
  {
    icon: <RiBuilding2Line className="MenuItem-icon" />,
    label: "Building",
    path: "/building",
    component: <Building />,
  },
  {
    icon: <FiUsers className="MenuItem-icon" />,
    label: "Resident",
    path: "/resident",
    component: <Resident />,
  },
  {
    icon: <FiUserCheck className="MenuItem-icon" />,
    label: "Request Premium",
    path: "/basicuserrequest",
    component: <RequestPremium />,
  },
  {
    icon: <FiZap className="MenuItem-icon" />,
    label: "Billing",
    path: "/billing",
    subpaths: ["/unit", "/category","/settlement"],
    component: <Billing />,
  },
  {
    icon: <RiFileTextLine className="MenuItem-icon" />,
    label: "Catat Meter",
    path: "/catatmeter",
    component: <CatatMeter />,
  },
  {
    icon: <RiCustomerService2Line className="MenuItem-icon" />,
    label: "Staff",
    path: "/staff",
    component: <Staff />,
  },
  {
    icon: <RiSurveyLine className="MenuItem-icon" />,
    label: "Task",
    path: "/task",
    component: <Task />,
  },
  // {
  //   icon: <RiAdvertisementLine className="MenuItem-icon" />,
  //   label: "Advertisement",
  //   path: "/advertisement",
  //   component: <Ads />,
  // },
  {
    icon: <FiVolume2 className="MenuItem-icon" />,
    label: "Announcement",
    path: "/announcement",
    component: <Announcement />,
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
      get(endpointAdmin + "/building/details/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
      })
    );
  }, [dispatch, id, building.refreshToggle]);

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
      <Route path={"/bm/chat/:rf"}>
        <Chat />
      </Route>
      <Route path={"/bm/chat"}>
        <Chat />
      </Route>
      <Route path={"/bm/settings"}>
        <div className="Container flex-column pr-3">
          <Tab
            labels={["General", "Departments"]}
            contents={[
              <>
                <div className="scroller-y pr-4">
                  <Details
                    editPath="building/edit"
                    labels={labels}
                    data={data}
                  />
                  <FeesSetting labels={picBmLabels} data={dataBM} />
                  <AutoAssignSetting labels={autoAssignLabel} data={dataBM} />
                  <AutoAnswerSetting labels={autoAnswerLabel} data={data} />
                </div>
              </>,
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
      <Route path={"/bm/auto-answer"}>
        <AutoAnswer />
      </Route>
    </Template>
  );
};

const dateArray = (() => {
  const array = Array(31).fill({});

  return array.map((el, index) => ({
    label: index + 1 + "",
    value: index + 1 + "",
  }));
})();

const FeesSetting = ({ data, labels }) => {
  const { auth } = useSelector((state) => state);
  const [modalFees, setModalFees] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <Modal
        disableFooter={true}
        isOpen={modalFees}
        title="Edit Fees"
        toggle={() => setModalFees(false)}
      >
        <Form
          noContainer={true}
          showCancel={true}
          onCancel={() => {
            setModalFees(false);
          }}
          onSubmit={(dataRef) => {
            const finalData = {
              building_id: auth.user.building_id,
              management_id: auth.user.management_id,
              ...dataRef,
            };
            dispatch(editBuildingManagement(finalData, data.id));
            setModalFees(false);
          }}
        >
          <Input
            label="Billing Published (Date)"
            name="billing_published"
            type="select"
            options={dateArray}
            inputValue={data.billing_published}
          />
          <Input
            label="Billing Due (Date)"
            name="billing_duedate"
            type="select"
            options={dateArray}
            inputValue={data.billing_duedate}
          />
          <Input
            label="Penalty Fee"
            type="number"
            addons="%"
            inputValue={data.penalty_fee}
          />
        </Form>
      </Modal>
      <div className="row mt-4">
        <div className="col">
          {Object.keys(labels).map((group, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                marginRight: 30,
              }}
            >
              <div
                style={{
                  color: "grey",
                  borderBottom: "1px solid silver",
                  width: 200,
                  marginBottom: 8,
                  marginLeft: 4,
                }}
              >
                {group}
              </div>
              {labels[group].map((el, i) => {
                return !el.disabled ? (
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                    key={i}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                        textTransform: "capitalize",
                      }}
                    >
                      {el.replace("_", " ")}
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {el === "penalty_fee"
                        ? data[el] + " %"
                        : "Day " + data[el]}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
        <div className="col-auto d-flex flex-column">
          <Button
            icon={<FiEdit />}
            label="Edit"
            onClick={() => {
              setModalFees(true);
            }}
          />
        </div>
      </div>
    </>
  );
};

const AutoAssignSetting = ({ data, labels }) => {
  const { auth } = useSelector((state) => state);
  const [modalAutoAssign, setModalAutoAssign] = useState(false);

  const dispatch = useDispatch();
  return (
    <>
      <Modal
        disableFooter={true}
        isOpen={modalAutoAssign}
        title="Edit Auto Assign"
        toggle={() => setModalAutoAssign(false)}
      >
        <Form
          noContainer={true}
          showCancel={true}
          onCancel={() => {
            setModalAutoAssign(false);
          }}
          onSubmit={(dataRef) => {
            const finalData = {
              building_id: auth.user.building_id,
              management_id: auth.user.management_id,
              auto_assign_limit: dataRef.task_assignment_limit,
              auto_assign_schedule_day: dataRef.schedule_next_auto_assign_day,
              ...dataRef,
            };
            dispatch(editBuildingManagement(finalData, data.id));
            setModalAutoAssign(false);
          }}
        >
          <Input
            label="Auto Assign"
            type="radio"
            name="auto_assign"
            inputValue={data.auto_assign}
            options={[
              { value: "y", label: "Yes", id: "y_assign" },
              { value: "n", label: "No", id: "n_assign" },
            ]}
          />
          <Input
            label="Task Assignment Limit"
            type="number"
            addons="task(s)"
            inputValue={data.auto_assign_limit}
          />
          <Input
            label="Schedule Next Auto Assign"
            type="radio"
            name="auto_assign_schedule"
            inputValue={data.auto_assign_schedule}
            options={[
              { value: "y", label: "Yes", id: "y_schedule" },
              { value: "n", label: "No", id: "n_schedule" },
            ]}
          />
          <Input
            label="Schedule Next Auto Assign Day"
            type="number"
            addons="day(s)"
            inputValue={data.auto_assign_schedule_day}
          />
        </Form>
      </Modal>
      <div className="row mt-4">
        <div className="col">
          {Object.keys(labels).map((group, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                marginRight: 30,
              }}
            >
              <div
                style={{
                  color: "grey",
                  borderBottom: "1px solid silver",
                  width: 200,
                  marginBottom: 8,
                  marginLeft: 4,
                }}
              >
                {group.replace(/_/g, " ")}
              </div>
              {labels[group].map((el, i) => {
                return !el.disabled ? (
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                    key={i}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                        textTransform: "capitalize",
                      }}
                    >
                      {el == "auto_assign_limit"
                        ? "Task Assignment Limit"
                        : el.replace(/_/g, " ")}
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {el === "auto_assign" || el === "auto_assign_schedule"
                        ? data[el] === "y"
                          ? "Yes"
                          : "No"
                        : el === "auto_assign_limit"
                        ? data[el]
                        : "Day " + data[el]}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
        <div className="col-auto d-flex flex-column">
          <Button
            icon={<FiEdit />}
            label="Edit"
            onClick={() => {
              setModalAutoAssign(true);
            }}
          />
        </div>
      </div>
    </>
  );
};

const RenderAutoAnswer = ({ data, el }) => {
  let text = data[el];
  if (el === "auto_answer") {
    text = data[el] === "y" ? "Active" : "Inactive";
  } else if (el === "auto_answer_image") {
    text = <img src={data[el]} style={{ width: 150 }} />;
  } else if (data[el] === " " || data[el] === "") {
    text = "-";
  }
  return (
    <div className="col" flex={9} style={{ fontWeight: "normal" }}>
      {el === "auto_answer_text"
        ? parser(typeof data[el] === "undefined" ? "" : data[el])
        : text}
    </div>
  );
};

const AutoAnswerSetting = ({ data, labels }) => {
  const { auth } = useSelector((state) => state);
  const [modalAutoAnswer, setModalAutoAnswer] = useState(false);
  const { selected, loading } = useSelector((state) => state.building);
  const [autoAnswer, setAutoAnswer] = useState(null);

  let history = useHistory();

  const dispatch = useDispatch();
  if (typeof data.auto_answer != "undefined" && autoAnswer === null) {
    setAutoAnswer(data.auto_answer);
  }
  return (
    <>
      <Modal
        disableFooter={true}
        isOpen={modalAutoAnswer}
        title="Edit Fees"
        toggle={() => setModalAutoAnswer(false)}
      >
        <Form
          noContainer={true}
          showCancel={true}
          onCancel={() => {
            setModalAutoAnswer(false);
          }}
          onSubmit={(dataRef) => {
            const finalData = { ...data, ...dataRef };
            finalData.auto_answer = autoAnswer;
            if (finalData.auto_answer == "n") {
              finalData.auto_answer_text = " ";
            }
            dispatch(editBuilding(finalData, history, selected.id, auth.role));
            setModalAutoAnswer(false);
          }}
        >
          <Input
            label="Auto Answer"
            type="radio"
            name="auto_assign"
            inputValue={autoAnswer}
            setInputValue={(val) => {
              setAutoAnswer(val);
            }}
            options={[
              { value: "y", label: "Yes" },
              { value: "n", label: "No" },
            ]}
          />
          {autoAnswer === "y" && (
            <Input
              label="Auto Answer Text"
              type="textarea"
              inputValue={data.auto_answer_text}
            />
          )}
        </Form>
      </Modal>
      <div className="row mt-4">
        <div className="col">
          {Object.keys(labels).map((group, i) => (
            <div
              key={i}
              style={{
                marginBottom: 16,
                marginRight: 30,
              }}
            >
              <div
                style={{
                  color: "grey",
                  borderBottom: "1px solid silver",
                  width: 200,
                  marginBottom: 8,
                  marginLeft: 4,
                }}
              >
                {group.replace(/_/g, " ")}
              </div>
              {labels[group].map((el, i) => {
                return !el.disabled ? (
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                    key={i}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                        textTransform: "capitalize",
                      }}
                    >
                      {el.replace(/_/g, " ")}
                    </div>
                    <RenderAutoAnswer data={data} el={el} />
                    {/* <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                    </div> */}
                  </div>
                ) : null;
              })}
            </div>
          ))}
        </div>
        <div className="col-auto d-flex flex-column">
          <Button
            icon={<FiEdit />}
            label="Edit"
            onClick={() => history.push({ pathname: "auto-answer" })}
          />
          {/* <Link>
            <Button
              icon={<FiEdit />}
              label="Edit"
              onClick={() => {
                history.push({
                  pathname: "settings/auto-answer",
                });
              }}
              // state: data,
            />
          </Link> */}
        </div>
      </div>
    </>
  );
};
