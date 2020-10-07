import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiSearch, FiPlus, FiCheck } from "react-icons/fi";
import moment from "moment";

import Button from "../../components/Button";
import Filter from "../../components/Filter";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Task from "../../components/cells/Task";
import Pill from "../../components/Pill";

import Resident from "../../components/cells/Resident";
import Staff from "../../components/cells/Staff";

import { useSelector } from "react-redux";
import {
  toSentenceCase,
  isRangeThisMonth,
  isRangeToday,
  dateTimeFormatterCell,
} from "../../utils";
import {
  endpointAdmin,
  endpointManagement,
  taskStatusColor,
} from "../../settings";
import {
  getTask,
  resolveTask,
  reassignTask,
  setSelected,
} from "../slices/task";
import { get } from "../slice";

import Template from "./components/TemplateWithSelection";
import DateRangeFilter from "../../components/DateRangeFilter";
import { getBuildingUnit } from "../slices/building";

const columns = [
  {
    Header: "Title",
    accessor: (row) => (
      <Task
        id={row.id}
        data={row}
        items={[row.title, <small>{row.ref_code}</small>]}
      />
    ),
  },
  {
    Header: "Created On",
    accessor: (row) => dateTimeFormatterCell(row.created_on),
  },
  {
    Header: "Department",
    accessor: (row) =>
      row.task_type === "service" ? (
        <>
          {toSentenceCase(row.task_type) +
            (row.department_name ? "- " + row.department_name : "")}
        </>
      ) : (
        toSentenceCase(row.task_type) +
        (row.department_name ? "- " + row.department_name : "")
      ),
  },
  {
    Header: "Priority",
    accessor: (row) => (
      <Pill
        color={
          row.priority === "emergency"
            ? "danger"
            : row.priority === "high"
            ? "warning"
            : "success"
        }
      >
        {toSentenceCase(row.priority)}
      </Pill>
    ),
  },
  {
    Header: "Requester",
    accessor: (row) => (
      <Resident
        compact={true}
        id={row.requester_id}
        data={row.requester_details}
      />
    ),
  },
  {
    Header: "Assignee",
    accessor: (row) =>
      row.assignee_id ? (
        <Staff
          compact={true}
          id={row.assignee_id}
          data={row.assignee_details}
        />
      ) : (
        "-"
      ),
  },
  {
    Header: "Assigned on",
    accessor: (row) =>
      row.assigned_on ? dateTimeFormatterCell(row.assigned_on) : "-",
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
];

const types = [
  { label: "Security", value: "security" },
  { label: "Service", value: "service" },
  { label: "Delivery", value: "delivery" },
];

const statuses = [
  { label: "Created", value: "created" },
  { label: "Canceled", value: "canceled" },
  { label: "Assigned", value: "assigned" },
  { label: "In Progress", value: "in_progress" },
  { label: "Reported", value: "reported" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Timeout", value: "timeout" },
];

const prios = [
  { label: "Emergency", value: "emergency" },
  { label: "High", value: "high" },
  { label: "Normal", value: "normal" },
  { label: "Low", value: "low" },
];

function Component({ view }) {
  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  const { role } = useSelector((state) => state.auth);

  const today = moment().format("yyyy-MM-DD");

  const [selectedRow, setRow] = useState({});
  const [limit, setLimit] = useState(5);
  const [resolve, setResolve] = useState(false);
  const [assign, setAssign] = useState(false);
  const [staff, setStaff] = useState({});
  const [staffs, setStaffs] = useState([]);

  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");

  const [status, setStatus] = useState("");
  const [statusLabel, setStatusLabel] = useState("");

  const [prio, setPrio] = useState("");
  const [prioLabel, setPrioLabel] = useState("");

  const defaultStartDate = moment().startOf("month").format("yyyy-MM-DD");
  const defaultEndDate = moment().endOf("month").format("yyyy-MM-DD");

  const [createdStart, setCreatedStart] = useState(defaultStartDate);
  const [createdEnd, setCreatedEnd] = useState(defaultEndDate);
  const [resolvedStart, setResolvedStart] = useState(defaultStartDate);
  const [resolvedEnd, setResolvedEnd] = useState(defaultEndDate);

  const [unit, setUnit] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [units, setUnits] = useState([]);
  const [unitSearch, setUnitSearch] = useState("");

  const [multiRows, setMultiRows] = useState([]);
  const [confirmMultiResolve, setConfirmMultiResolve] = useState(false);

  useEffect(() => {
    history.location.state &&
      history.location.state.type &&
      setType(history.location.state.type);
    history.location.state &&
      history.location.state.status &&
      setStatus(history.location.state.status);

    history.location.state &&
      history.location.state.typeLabel &&
      setTypeLabel(history.location.state.typeLabel);
    history.location.state &&
      history.location.state.statusLabel &&
      setStatusLabel(history.location.state.statusLabel);
  }, [history.location.state]);

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
    if (search.length === 0) setLimit(5);
  }, [search]);

  useEffect(() => {
    let staffRole =
      selectedRow.task_type === "security"
        ? "security"
        : selectedRow.task_type === "service"
        ? "technician"
        : "courier";

    assign &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1&max_ongoing_task=1" +
            (selectedRow?.department_id
              ? "&department_id=" + selectedRow.department_id
              : "") +
            "&staff_role=" +
            staffRole +
            "&status=active" +
            (selectedRow.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label:
                el.departments.length > 0 ? (
                  <ListFilter data={el} />
                ) : (
                  el.firstname + " " + el.lastname
                ),
              value: el.id,
            }));

            console.log(formatted);

            setStaffs(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, selectedRow]);

  useEffect(() => {
    building &&
      dispatch(
        get(
          endpointAdmin +
            "/building/unit" +
            "?page=1" +
            "&building_id=" +
            building +
            "&search=" +
            unitSearch +
            "&sort_field=created_on&sort_type=DESC" +
            "&limit=" +
            limit,
          (res) => {
            let data = res.data.data.items;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            const formatted = res.data.data.items.map((el) => ({
              label:
                toSentenceCase(el.section_type) +
                " " +
                el.section_name +
                " " +
                el.number,
              value: el.id,
            }));

            if (data.length < totalItems && unitSearch.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setUnits(formatted);
          }
        )
      );
  }, [building, dispatch, limit, unitSearch]);

  return (
    <>
      <Modal
        isOpen={confirmMultiResolve}
        disableHeader={true}
        onClick={() => {
          const data = multiRows.map((el) => el);
          dispatch(resolveTask(data));
          setMultiRows([]);
          setConfirmMultiResolve(false);
        }}
        toggle={() => {
          setConfirmMultiResolve(false);
          setMultiRows([]);
        }}
        okLabel={"Resolve All"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to resolve these tasks?
        <p style={{ paddingTop: "10px" }}>
          <ul>
            {multiRows.map((el) => (
              <li>
                {el.ref_code} - {el.title}
              </li>
            ))}
          </ul>
        </p>
      </Modal>
      <Modal
        isOpen={resolve}
        toggle={() => setResolve(false)}
        disableHeader
        okLabel="Yes"
        onClick={() => {
          setResolve(false);
          dispatch(resolveTask([selectedRow]));
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setResolve(false);
        }}
      >
        Are you sure you want to resolve this task?
      </Modal>
      <Modal
        isOpen={assign}
        toggle={() => setAssign(false)}
        disableHeader
        disableFooter={staffs.length === 0}
        okLabel="Yes"
        onClick={() => {
          setStaff({});
          setAssign(false);
          dispatch(
            reassignTask({
              task_id: selectedRow.id,
              assignee_id: staff.value,
            })
          );
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setStaff({});
          setAssign(false);
        }}
      >
        Choose assignee:
        {staffs.length !== 0 && !staff.value && (
          <Input
            label="Search"
            icon={<FiSearch />}
            compact
            inputValue={search}
            setInputValue={setSearch}
          />
        )}
        <Filter
          data={staff.value ? [staff] : staffs}
          onClick={(el) => setStaff(el)}
        />
        {staffs.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No elligible staff found.
          </p>
        )}
      </Modal>
      <Template
        filterExpanded={history.location.state}
        view={view}
        columns={columns}
        slice="task"
        getAction={getTask}
        selectAction={(selectedRows) =>
          setMultiRows(selectedRows.filter((el) => el.status !== "completed"))
        }
        filterVars={[
          type,
          prio,
          status,
          building,
          unit,
          createdStart,
          createdEnd,
          ...(status === "completed" ? [resolvedStart, resolvedEnd] : []),
        ]}
        filters={[
          {
            hidex: isRangeThisMonth(createdStart, createdEnd),
            label: "Created Date: ",
            delete: () => {
              setCreatedStart(moment().startOf("month").format("yyyy-MM-DD"));
              setCreatedEnd(moment().endOf("month").format("yyyy-MM-DD"));
            },
            value:
              moment(createdStart).format("DD-MM-yyyy") +
              " - " +
              moment(createdEnd).format("DD-MM-yyyy"),
            component: (toggleModal) => (
              <DateRangeFilter
                startDate={createdStart}
                endDate={createdEnd}
                onApply={(start, end) => {
                  setCreatedStart(start);
                  setCreatedEnd(end);
                  toggleModal();
                }}
              />
            ),
          },
          ...(status === "completed"
            ? [
                {
                  hidex: isRangeToday(resolvedStart, resolvedEnd),
                  label: "Resolved Date: ",
                  delete: () => {
                    setResolvedStart(today);
                    setResolvedEnd(today);
                  },
                  value: isRangeToday(resolvedStart, resolvedEnd)
                    ? "Today"
                    : moment(resolvedStart).format("DD-MM-yyyy") +
                      " - " +
                      moment(resolvedEnd).format("DD-MM-yyyy"),
                  component: (toggleModal) => (
                    <DateRangeFilter
                      startDate={resolvedStart}
                      endDate={resolvedEnd}
                      onApply={(start, end) => {
                        setResolvedStart(start);
                        setResolvedEnd(end);
                        toggleModal();
                      }}
                    />
                  ),
                },
              ]
            : []),
          ...(building
            ? [
                {
                  hidex: unit === "",
                  label: "Unit: ",
                  value: unit ? unitLabel : "All",
                  delete: () => {
                    setUnit("");
                  },
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search Unit"
                        compact
                        icon={<FiSearch />}
                        inputValue={unitSearch}
                        setInputValue={setUnitSearch}
                      />
                      <Filter
                        data={units}
                        onClick={(el) => {
                          if (!el.value) {
                            setLimit(limit + el.restTotal);
                            return;
                          }
                          setUnit(el.value);
                          setUnitLabel(el.label);
                          setLimit(5);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setUnit("");
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
            value: building ? buildingName : "All",
            delete: () => {
              setBuilding("");
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
                    setBuildingName(el.label);
                    setLimit(5);
                    toggleModal(false);
                  }}
                  onClickAll={() => {
                    setBuilding("");
                    setBuildingName("");
                    setLimit(5);
                    toggleModal(false);
                  }}
                />
              </>
            ),
          },
          {
            hidex: type === "",
            label: "Type: ",
            value: type ? typeLabel : "All",
            delete: () => {
              setType("");
            },
            component: (toggleModal) => (
              <Filter
                data={types}
                onClick={(el) => {
                  setType(el.value);
                  setTypeLabel(el.label);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setType("");
                  setTypeLabel("");
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: prio === "",
            label: "Priority: ",
            value: prio ? prioLabel : "All",
            delete: () => {
              setPrio("");
            },
            component: (toggleModal) => (
              <Filter
                data={prios}
                onClick={(el) => {
                  setPrio(el.value);
                  setPrioLabel(el.label);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setPrio("");
                  setPrioLabel("");
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: status === "",
            label: "Status: ",
            value: status ? statusLabel : "All",
            delete: () => {
              setStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={statuses}
                onClick={(el) => {
                  setStatus(el.value);
                  setStatusLabel(el.label);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setStatus("");
                  setStatusLabel("");
                  toggleModal(false);
                }}
              />
            ),
          },
        ]}
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <>
                    {Object.keys(selectedRowIds).length > 0 && (
                      <Button
                        icon={<FiCheck />}
                        color="success"
                        onClick={() => {
                          setConfirmMultiResolve(true);
                        }}
                        label="Resolve All"
                      />
                    )}
                  </>,
                  role === "bm" && (
                    <Button
                      key="Add Task"
                      label="Add Task"
                      icon={<FiPlus />}
                      onClick={() => {
                        dispatch(setSelected({}));
                        history.push(url + "/add");
                      }}
                    />
                  ),
                ];
              }
        }
        onClickResolve={
          view
            ? null
            : (row) => {
                setRow(row);
                setResolve(true);
              }
        }
        onClickReassign={
          view
            ? null
            : (row) => {
                setRow(row);
                setAssign(true);
              }
        }
        onClickChat={
          view
            ? null
            : role === "sa"
            ? null
            : (row) => {
                dispatch(setSelected(row));
                history.push("chat/" + row.ref_code);
              }
        }
      />
    </>
  );
}

export default Component;

const ListFilter = ({ data }) => {
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      {data.firstname + " " + data.lastname}
      <button
        className="ml-2"
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        See Departments
      </button>
      <div
        className={"list-modal-hover text-left" + (modalHover ? " on" : "")}
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
