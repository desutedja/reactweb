import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@material-ui/lab";

import Row from "../../../components/Row";
import Resident from "../../../components/cells/Resident";
import Staff from "../../../components/cells/Staff";
import Column from "../../../components/Column";
import TwoColumn from "../../../components/TwoColumn";
import Pill from "../../../components/Pill";
import { dateTimeFormatter, toSentenceCase, toMoney } from "../../../utils";
import { MdChatBubble } from "react-icons/md";
import { FiCheck, FiFile, FiFileText, FiUserPlus } from "react-icons/fi";

import Button from "../../../components/Button";
import Filter from "../../../components/Filter";
import Modal from "../../../components/Modal";

import { Form } from "reactstrap";
import { Input } from "reactstrap";
import InputDash from "../../../components/InputDash";
import SubmitButton from "../../form/components/SubmitButton";

import Template from "../components/Template";
import parse from 'html-react-parser';

import { Card, CardHeader, CardFooter, CardTitle, CardBody } from "reactstrap";

import { useParams } from "react-router-dom";
import { get } from "../../slice";
import { resolveTask, reassignTask, setSelected, delegateTask, rejectDelegate, acceptAssignHelper, rejectHelper } from "../../slices/task";
import {
  endpointTask,
  endpointManagement,
  taskPriorityColor,
  taskStatusColor,
} from "../../../settings";

const attachments = [
  "attachment_1",
  "attachment_2",
  "attachment_3",
  "attachment_4",
  "attachment_5",
];

function Component({ view, canUpdate, canAdd, canDelete }) {
  const [modal, setModal] = useState(false);
  // const [mapModal, setMapModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [image, setImage] = useState("");
  const [data, setData] = useState({});
  // const [lat, setLat] = useState(0.000);
  // const [long, setLong] = useState(0.000);

  const [assign, setAssign] = useState(false);
  const [delegate, setDelegate] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectingHelper, setRejectingHelper] = useState(false);
  const [assignHelper, setAssignHelper] = useState(false);
  const [resolve, setResolve] = useState(false);
  const [staff, setStaff] = useState({});
  const [staffs, setStaffs] = useState([]);
  const [staffHelper, setStaffHelper] = useState({});
  const [staffHelpers, setStaffHelpers] = useState([]);
  const [staffDelegate, setStaffDelegate] = useState({});
  const [staffDelegates, setStaffDelegates] = useState([]);
  const [rejectMessage, setRejectMessage] = useState("");
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [staffRejectDelegates, setStaffRejectDelegates] = useState([]);
  const [staffRejectHelper, setStaffRejectHelper] = useState([]);
  const [
    search,
    // setSearch
  ] = useState("");

  const history = useHistory();

  const { refreshToggle } = useSelector((state) => state.task);
  const { role } = useSelector((state) => state.auth);

  let dispatch = useDispatch();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointTask + "/admin/" + id, (res) => {
        setData(res.data.data);
      })
    );
  }, [dispatch, id, refreshToggle]);

  useEffect(() => {
    let staffRole =
      data.task_type === "security"
        ? "security"
        : data.task_type === "service"
        ? "technician"
        : "courier";
    let department = 
      data.department?.id

    assign &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1" +
            "&department_id=" + 
            // department +
            "&task_id=" +
            id +
            "&staff_role=" +
            "all_staff" +
            // staffRole +
            "&status=active" +
            (data.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.firstname + " " + el.lastname,
              value: el.id,
            }));

            setStaffs(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, data, assign]);

  useEffect(() => {
    let staffRole =
      data.task_type === "security"
        ? "security"
        : data.task_type === "service"
        ? "technician"
        : "courier";
    let department = 
      data.department?.id

    assignHelper &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1" +
            "&department_id=" + 
            // department +
            "&task_id=" +
            id +
            "&staff_role=" +
            "all_staff" +
            // staffRole +
            "&status=active" +
            (data.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.firstname + " " + el.lastname,
              value: el.id,
            }));

            setStaffHelpers(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, data, assignHelper]);

  useEffect(() => {
    let staffRole =
      data.task_type === "security"
        ? "security"
        : data.task_type === "service"
        ? "technician"
        : "courier";
    let department = 
      data.department?.id

    delegate &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1" +
            "&department_id=" + 
            // department +
            "&task_id=" +
            id +
            "&staff_role=" +
            "all_staff" +
            // staffRole +
            "&status=active" +
            (data.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.firstname + " " + el.lastname,
              value: el.id,
            }));

            setStaffDelegates(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, data, delegate]);

  useEffect(() => {
    let staffRole =
      data.task_type === "security"
        ? "security"
        : data.task_type === "service"
        ? "technician"
        : "courier";
    let department = 
      data.department?.id

    reject &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1" +
            "&department_id=" + 
            // department +
            "&task_id=" +
            id +
            "&staff_role=" +
            "all_staff" +
            // staffRole +
            "&status=active" +
            (data.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.firstname + " " + el.lastname,
              value: el.id,
            }));

            setStaffRejectDelegates(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, data, reject]);
  
  useEffect(() => {
    let staffRole =
      data.task_type === "security"
        ? "security"
        : data.task_type === "service"
        ? "technician"
        : "courier";
    let department = 
      data.department?.id

    rejectingHelper &&
      (!search || search.length >= 1) &&
      dispatch(
        get(
          endpointManagement +
            "/admin/staff/list" +
            "?limit=5&page=1" +
            "&department_id=" + 
            // department +
            "&task_id=" +
            id +
            "&staff_role=" +
            "all_staff" +
            // staffRole +
            "&status=active" +
            (data.priority === "emergency"
              ? "&is_ongoing_emergency=true"
              : "") +
            "&search=" +
            search,
          (res) => {
            let data = res.data.data.items;

            let formatted = data.map((el) => ({
              label: el.firstname + " " + el.lastname,
              value: el.id,
            }));

            setStaffRejectHelper(formatted);
          }
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, data, rejectingHelper]);

  return (
    <>
      <Modal
        width="750px"
        title="Task History"
        disableFooter={true}
        isOpen={historyModal}
        toggle={() => setHistoryModal(false)}
      >
        <Timeline align="alternate">
          {data.task_logs &&
            data.task_logs.map((el, index) => (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  {index === data.task_logs.length - 1 || <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <b>{toSentenceCase(el.status)}</b>
                  <div>{dateTimeFormatter(el.created_on)}</div>
                  <div>{el.description}</div>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </Modal>
      <Modal disableFooter isOpen={modal} toggle={() => setModal(false)}>
        <img
          src={image}
          alt="attachment"
          style={{
            maxHeight: 600,
            maxWidth: "100%",
          }}
        />
      </Modal>
      <Modal
        isOpen={resolve}
        toggle={() => setResolve(false)}
        disableHeader
        okLabel="Yes"
        onClick={() => {
          setResolve(false);
          dispatch(resolveTask([{ ...data, id: data.task_id }]));
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setResolve(false);
        }}
      >
        Are you sure you want to resolve this task?
      </Modal>
      <Modal
        isOpen={attachmentModal}
        toggle={() => setAttachmentModal(false)}
        okLabel="Submit"
        onClick={() => {
          setAttachmentModal(false);
          // dispatch(resolveTask([{ ...data, id: data.task_id }]));
        }}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setAttachmentModal(false);
        }}
      >
        <InputDash
          type="file"
          label="Attachment"
          placeholder="Insert File"
          name="attachment"
          accept="image/*"
        />
      </Modal>
      <Modal
        title="Add Report"
        isOpen={reportModal}
        toggle={() => setReportModal(false)}
        okLabel="Submit"
        onClick={() => {
          setReportModal(false);
          // dispatch(resolveTask([{ ...data, id: data.task_id }]));
        }}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setReportModal(false);
        }}
      >
        <Input
          type="textarea"
          label="Report"
          placeholder="Insert Description"
          name="report"
        />
      </Modal>
      <Modal
        title="Assign Staff"
        subtitle="Choose eligible staffs to assign for this task"
        isOpen={assign}
        toggle={() => setAssign(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setStaff({});
          setAssign(false);
        }}
      >
        <Filter
          data={staff.value ? [staff] : staffs}
          onClick={(el) => {
            dispatch(
              reassignTask({
                task_id: parseInt(data.task_id),
                assignee_id: el.value,
              })
            );
            setStaff({});
            setAssign(false);
          }}
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
      <Modal
        title="Assign Helper"
        subtitle="Choose eligible helpers to assist this task"
        isOpen={assignHelper}
        toggle={() => setAssignHelper(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setStaffHelper({});
          setAssignHelper(false);
        }}
      >
        <>
        <Filter
          data={staffHelper.value ? [staffHelper] : staffHelpers}
          onClick={(el) => {
            dispatch(
              acceptAssignHelper({
                task_id: parseInt(data.task_id),
                helper_id: el.value
              })
            );
            setStaffHelper({});
            setAssignHelper(false);
          }}
        />
        </>
      </Modal>
      <Modal
        title="Delegate Staff"
        subtitle="Choose eligible staffs to assign for this task"
        isOpen={delegate}
        toggle={() => setDelegate(false)}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setStaffDelegate({});
          setDelegate(false);
        }}
      >
        <Filter
          data={staffDelegate.value ? [staffDelegate] : staffDelegates}
          onClick={(el) => {
            dispatch(
              delegateTask({
                request_delegate_id: (data.request_delegate?.id),
                task_id: parseInt(data.task_id),
                assignee_id: parseInt(data.assignee),
                delegate_id: el.value,
                status: "ask_staff"
              })
            );
            setStaffDelegate({});
            setDelegate(false);
          }}
        />
        {staffDelegates.length === 0 && (
          <p
            style={{
              fontStyle: "italic",
            }}
          >
            No elligible staff found.
          </p>
        )}
      </Modal>
      <Modal
        title="Reject Delegate Request"
        isOpen={reject}
        toggle={() => setReject(false)}
        okLabel="Yes"
        onClick={() => {
          setReject(false);
          dispatch(
            rejectDelegate({
              request_delegate_id: (data.request_delegate?.id),
              reject_message: rejectMessage,
            })
          );
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setReject(false);
        }}
      >
        Are you sure you want to reject delegate this task?
        <Input
            value={rejectMessage}
            type="text" onChange={(e) => setRejectMessage(e.target.value)}
            placeholder='Type rejection message here'
        />
      </Modal>
      <Modal
        title="Reject Delegate Request"
        isOpen={rejectingHelper}
        toggle={() => setRejectingHelper(false)}
        okLabel="Yes"
        onClick={() => {
          setRejectingHelper(false);
          dispatch(
            rejectHelper({
              request_helper_id: (data.request_helper?.id),
              reject_message: rejectMessage,
            })
          );
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setRejectingHelper(false);
        }}
      >
        Are you sure you want to reject delegate this task?
        <Input
            value={rejectMessage}
            type="text" onChange={(e) => setRejectMessage(e.target.value)}
            placeholder='Type rejection message here'
        />
      </Modal>

      <Template
        transparent
        loading={!data.task_id}
        labels={["Details"]}
        contents={[
          <>
            <Column style={{ width: "100%" }}>
              <Row>
                <Column style={{ flex: "6", display: "block" }}>
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardHeader>
                      <TwoColumn
                        first={data.ref_code}
                        second={
                          <div>
                            <b>{toSentenceCase(data.task_type)}</b>
                            {data.task_specialization && (
                              <b>
                                {" - " +
                                  toSentenceCase(data.task_specialization)}
                              </b>
                            )}
                            <b> Type</b>
                          </div>
                        }
                      />
                    </CardHeader>
                    <CardBody>
                      <Row
                        style={{
                          justifyContent: "space-between",
                          alignItems: "bottom",
                        }}
                      >
                        <CardTitle>
                          <h5>{data.title}</h5>
                        </CardTitle>
                        <div>
                          <Pill color={taskPriorityColor[data.priority]}>
                            {toSentenceCase(data.priority) + " Priority"}
                          </Pill>
                        </div>
                      </Row>
                      <div style={{ display: "column", lineHeight: "1.5em" }}>
                        <div>
                          <small>
                            Created At: {dateTimeFormatter(data.created_on)}
                          </small>
                        </div>
                        <div style={{ color: "rgba(0, 0, 0, 0.768)" }}>
                          {data.description || <i>No Description</i>}
                        </div>
                      </div>
                    </CardBody>
                    {role === "bm" && (
                      <CardFooter>
                        <div style={{ textAlign: "right", padding: "5px" }}>
                          <Link
                            to={"/" + role + "/chat/" + data.ref_code}
                            onClick={() => {
                              dispatch(setSelected(data));
                              history.push(
                                "/" + role + "/chat/" + data.ref_code
                              );
                            }}
                          >
                            <MdChatBubble size="17" /> Go to chatroom
                          </Link>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    {/* <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={"Attachment"}
                        second={
                          <div>
                            <Link
                              to="#"
                              onClick={() => {
                                setAttachmentModal(true);
                              }}
                            >
                              + Add Attachment
                            </Link>
                          </div>
                        }
                      />
                    </CardHeader> */}
                    <CardBody>
                      <h5>Attachment</h5>
                      <hr />
                      {data.attachment_1 ? (
                        attachments.map(
                          (el) =>
                            data[el] && (
                              <img
                                src={data[el]}
                                alt="attachment"
                                onClick={() => {
                                  setModal(true);
                                  setImage(data[el]);
                                }}
                                style={{
                                  height: 80,
                                  aspectRatio: 1,
                                }}
                              />
                            )
                        )
                      ) : (
                        <div
                          style={{
                            color: "silver",
                          }}
                        >
                          <i>No Attachment</i>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    {/* <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={"Reports"}
                        second={
                          <div>
                            <Link
                              to="#"
                              onClick={() => {
                                setReportModal(true);
                              }}
                            >
                              + Add Report
                            </Link>
                          </div>
                        }
                      />
                    </CardHeader> */}
                    <CardBody>
                      <h5>Reports</h5>
                      <hr />
                      <Column style={{ lineHeight: "1.5em" }}>
                        {data.task_reports?.length > 0 ? (
                          <>
                            {data.task_reports.map((el, index) => (
                              <>
                                <Row>
                                  <div>
                                    <div>
                                      <b>
                                        {" "}
                                        Report {index + 1} by {el.assignee_name}{" "}
                                      </b>
                                    </div>
                                    <small>
                                      Created At:{" "}
                                      {dateTimeFormatter(el.created_on)}
                                    </small>
                                  </div>
                                </Row>
                                <Row>{parse(el.description)}</Row>
                                <hr />
                                <Row>
                                  {el.attachments > 0 &&
                                    attachments.map(
                                      (key) =>
                                        el[key] && (
                                          <img
                                            src={el[key]}
                                            alt="attachment"
                                            onClick={() => {
                                              setModal(true);
                                              setImage(el[key]);
                                            }}
                                            style={{
                                              height: 80,
                                              aspectRatio: 1,
                                            }}
                                          />
                                        )
                                    )}
                                </Row>
                              </>
                            ))}
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Report Submitted Yet</i>
                          </div>
                        )}
                      </Column>
                    </CardBody>
                  </Card>
                </Column>
                <Column
                  style={{ flex: "4", display: "block", maxWidth: "700px" }}
                >
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <TwoColumn
                        first={<h5>Status</h5>}
                        second={
                          <div>
                            <Link
                              to="#"
                              onClick={() => {
                                setHistoryModal(true);
                              }}
                            >
                              See History
                            </Link>
                          </div>
                        }
                      />
                      <div>
                        <Pill color={taskStatusColor[data.status]}>
                          {toSentenceCase(data.status)}
                        </Pill>
                      </div>
                    </CardBody>
                    {view
                      ? null
                      : (role === "bm" ? canUpdate : true)
                      ? data.status !== "completed" &&
                        data.status !== "canceled" && (
                          <CardFooter>
                            <Button
                              onClick={() => setResolve(true)}
                              icon={<FiCheck />}
                              label="Set As Resolved"
                            />
                          </CardFooter>
                        )
                      : null}
                  </Card>
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <TwoColumn
                        first={<h5>Requester</h5>}
                        // second={
                        //     data.priority === "emergency" && <div><Link to="#" onClick={() => {
                        //         setMapModal(true);
                        //         setLat(data.r_lat);
                        //         setLong(data.r_long);
                        //     }}><MdLocationOn size="15" /> Last Location</Link></div>
                        // }
                      />
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }}
                      >
                        <div
                          className="col-12 col-lg-6"
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        >
                          <Resident
                            id={data.requester}
                            data={{
                              id: data.requester,
                              photo: data.resident_photo,
                              firstname: data.requester_name,
                              lastname: "",
                              email: data.requester_phone,
                            }}
                          />
                        </div>
                        <span
                          className="border-right h-100 d-none d-lg-block"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        ></span>
                        <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                          <b>Location</b>
                          <div>
                            {data.requester_section_type +
                              " " +
                              data.requester_section_name +
                              " " +
                              data.requester_unit_number}
                            <div>Floor {data.requester_unit_floor}</div>
                            <div>{data.requester_building_name}</div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  {view ? null : (data.request_delegate === null && data.request_helper === null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                            <div
                              className="col-12 col-lg-6"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              <Staff
                                id={data.assignee}
                                data={{
                                  photo: data.assignee_photo,
                                  firstname: data.assignee_name,
                                  lastname: "",
                                  staff_role: data.assignee_role,
                                }}
                              />
                            </div>
                            <span
                              className="border-right h-50 d-none d-lg-block"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            ></span>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                              <b>Assigned by</b>
                              <div>
                                {data.assigned_by_name
                                  ? data.assigned_by_name
                                  : "Automatic Assignment"}
                              </div>
                              <div>{dateTimeFormatter(data.assigned_on)}</div>
                              {data.task_type === "delivery" && (
                                <div>
                                  <b>Fee : {toMoney(data.assignee_fee)}</b>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.status === "created" || data.status === "rejected") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssign(true)}
                          icon={<FiUserPlus />}
                          label="Assign Staff"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status === "reject" || data.request_delegate === null) && (data.request_helper === null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Assign Helper"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) : view ? null : (data.status === "completed") && ((data.request_delegate === null || data.request_helper === null) || (data.request_delegate === null && data.request_helper === null)) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                            <div
                              className="col-12 col-lg-6"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              <Staff
                                id={data.assignee}
                                data={{
                                  photo: data.assignee_photo,
                                  firstname: data.assignee_name,
                                  lastname: "",
                                  staff_role: data.assignee_role,
                                }}
                              />
                            </div>
                            <span
                              className="border-right h-50 d-none d-lg-block"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            ></span>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                              <b>Assigned by</b>
                              <div>
                                {data.assigned_by_name
                                  ? data.assigned_by_name
                                  : "Automatic Assignment"}
                              </div>
                              <div>{dateTimeFormatter(data.assigned_on)}</div>
                              {data.task_type === "delivery" && (
                                <div>
                                  <b>Fee : {toMoney(data.assignee_fee)}</b>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.status === "created" || data.status === "rejected") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssign(true)}
                          icon={<FiUserPlus />}
                          label="Assign Staff"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status === "reject" || data.request_delegate === null) && (data.request_helper === null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Assign Helper"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) : view ? null : (data.status !== null ) && (data.request_delegate === null && data.request_helper === null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                            <div
                              className="col-12 col-lg-6"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              <Staff
                                id={data.assignee}
                                data={{
                                  photo: data.assignee_photo,
                                  firstname: data.assignee_name,
                                  lastname: "",
                                  staff_role: data.assignee_role,
                                }}
                              />
                            </div>
                            <span
                              className="border-right h-50 d-none d-lg-block"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            ></span>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                              <b>Assigned by</b>
                              <div>
                                {data.assigned_by_name
                                  ? data.assigned_by_name
                                  : "Automatic Assignment"}
                              </div>
                              <div>{dateTimeFormatter(data.assigned_on)}</div>
                              {data.task_type === "delivery" && (
                                <div>
                                  <b>Fee : {toMoney(data.assignee_fee)}</b>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.status === "created" || data.status === "rejected") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssign(true)}
                          icon={<FiUserPlus />}
                          label="Assign Staff"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status === "reject" || data.request_delegate === null) && (data.request_helper === null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Assign Helper"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) :
                      view ? null : (data.request_delegate !== null || data.request_helper !== null) && (data.request_delegate?.status === "requested") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                            <div
                              className="col-12 col-lg-6"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              <Staff
                                id={data.assignee}
                                data={{
                                  photo: data.assignee_photo,
                                  firstname: data.assignee_name,
                                  lastname: "",
                                  staff_role: data.assignee_role,
                                }}
                              />
                            </div>
                            <span
                              className="border-right h-50 d-none d-lg-block"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            ></span>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                              <b>Assigned by</b>
                              <div>
                                {data.assigned_by_name
                                  ? data.assigned_by_name
                                  : "Automatic Assignment"}
                              </div>
                              <div>{dateTimeFormatter(data.assigned_on)}</div>
                              {data.task_type === "delivery" && (
                                <div>
                                  <b>Fee : {toMoney(data.assignee_fee)}</b>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.status === "created" || data.status === "rejected") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssign(true)}
                          icon={<FiUserPlus />}
                          label="Assign Staff"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status === "reject" || data.request_delegate === null) && (data.request_helper !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Assign Helper"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) : 
                      view ? null : (data.status === "in_progress" || data.status === "rejected") && (data.request_helper?.status === "requested") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                          <div
                            className="col-12 col-lg-6"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <Staff
                              id={data.assignee}
                              data={{
                                photo: data.assignee_photo,
                                firstname: data.assignee_name,
                                lastname: "",
                                staff_role: data.assignee_role,
                              }}
                            />
                          </div>
                          <span
                            className="border-right h-50 d-none d-lg-block"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></span>
                          <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                            <b>Assigned by</b>
                            <div>
                              {data.assigned_by_name
                                ? data.assigned_by_name
                                : "Automatic Assignment"}
                            </div>
                            <div>{dateTimeFormatter(data.assigned_on)}</div>
                            {data.task_type === "delivery" && (
                              <div>
                                <b>Fee : {toMoney(data.assignee_fee)}</b>
                              </div>
                            )}
                          </div>
                          <div className="col-12 mt-4" >
                            <h5>Helper</h5>
                            <div
                              className="row no-gutters flex-wrap"
                              style={{ position: "relative" }} 
                            >
                              {data.assignee ? (
                                <>
                                  <div
                                    className="col-12 col-lg-6"
                                    style={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {(data.request_helper?.status === "requested") ? (
                                      <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                        <i>No Assigned Staff Yet</i>
                                      </div>) : <Staff
                                      id={data.request_helper?.helper_profile?.helper_id}
                                      data={{
                                        photo: data.request_helper?.helper_profile?.helper_photo,
                                        firstname: data.request_helper?.helper_profile?.helper_firstname,
                                        lastname: data.request_helper?.helper_profile?.helper_lastname,
                                        staff_role: data.assignee_role,
                                      }}
                                    />}
                                  </div>
                                  <span
                                    className="border-right h-100 d-none d-lg-block"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                    }}
                                  ></span>
                                  <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                                    <b>Request Date</b>
                                    <div>{dateTimeFormatter(data.request_helper?.created_on)}</div>
                                    {data.task_type === "delivery" && (
                                      <div>
                                        <b>Fee : {toMoney(data.assignee_fee)}</b>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                  <i>No Helper Staff Yet</i>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.status === "rejected" ||
                        data.status === "created") && (data.request_delegate?.status !== "requested" && data.request_delegate?.status !== "rejected") && (data.request_helper?.status !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssign(true)}
                          icon={<FiUserPlus />}
                          label="Assign Helper"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status !== "rejected") && (data.request_helper?.status !== "rejected" || data.request_helper?.status === "requested") && (data.request_helper !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Accept"
                          />
                          <Button
                            color={ 'Danger'}
                            onClick={() => setRejectingHelper(true)}
                            label="Reject"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) : view ? null : (data.status === "in_progress" || data.status === "rejected") && (data.request_helper?.status === "ask_staff") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                          <div
                            className="col-12 col-lg-6"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <Staff
                              id={data.assignee}
                              data={{
                                photo: data.assignee_photo,
                                firstname: data.assignee_name,
                                lastname: "",
                                staff_role: data.assignee_role,
                              }}
                            />
                          </div>
                          <span
                            className="border-right h-50 d-none d-lg-block"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></span>
                          <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                            <b>Assigned by</b>
                            <div>
                              {data.assigned_by_name
                                ? data.assigned_by_name
                                : "Automatic Assignment"}
                            </div>
                            <div>{dateTimeFormatter(data.assigned_on)}</div>
                            {data.task_type === "delivery" && (
                              <div>
                                <b>Fee : {toMoney(data.assignee_fee)}</b>
                              </div>
                            )}
                          </div>
                          <div className="col-12 mt-4" >
                            <h5>Helper</h5>
                            <div
                              className="row no-gutters flex-wrap"
                              style={{ position: "relative" }} 
                            >
                              {data.assignee ? (
                                <>
                                  <div
                                    className="col-12 col-lg-6"
                                    style={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {(data.request_helper?.status === "ask_staff") ? (
                                      <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                        <i>Waiting for request to be accepted</i>
                                      </div>) : <Staff
                                      id={data.request_helper?.helper_profile?.helper_id}
                                      data={{
                                        photo: data.request_helper?.helper_profile?.helper_photo,
                                        firstname: data.request_helper?.helper_profile?.helper_firstname,
                                        lastname: data.request_helper?.helper_profile?.helper_lastname,
                                        staff_role: data.assignee_role,
                                      }}
                                    />}
                                  </div>
                                  <span
                                    className="border-right h-100 d-none d-lg-block"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                    }}
                                  ></span>
                                  <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                                    <b>Request Date</b>
                                    <div>{dateTimeFormatter(data.request_helper?.created_on)}</div>
                                    {data.task_type === "delivery" && (
                                      <div>
                                        <b>Fee : {toMoney(data.assignee_fee)}</b>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                  <i>No Helper Staff Yet</i>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    
                  </Card>
                      ) : view ? null : (data.status === "in_progress" || data.status === "rejected" || data.status === "completed" || data.status === "reported" || data.status === "approved") && ((data.request_helper?.status === "approved") && (data.request_delegate === null || data.request_delegate?.status === "rejected")) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                          <div
                            className="col-12 col-lg-6"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <Staff
                              id={data.assignee}
                              data={{
                                photo: data.assignee_photo,
                                firstname: data.assignee_name,
                                lastname: "",
                                staff_role: data.assignee_role,
                              }}
                            />
                          </div>
                          <span
                            className="border-right h-50 d-none d-lg-block"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></span>
                          <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                            <b>Assigned by</b>
                            <div>
                              {data.assigned_by_name
                                ? data.assigned_by_name
                                : "Automatic Assignment"}
                            </div>
                            <div>{dateTimeFormatter(data.assigned_on)}</div>
                            {data.task_type === "delivery" && (
                              <div>
                                <b>Fee : {toMoney(data.assignee_fee)}</b>
                              </div>
                            )}
                          </div>
                          <div className="col-12 mt-4" >
                            <h5>Helper</h5>
                            <div
                              className="row no-gutters flex-wrap"
                              style={{ position: "relative" }} 
                            >
                              {data.assignee ? (
                                <>
                                  <div
                                    className="col-12 col-lg-6"
                                    style={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {(data.request_helper?.status === "ask_staff") ? (
                                      <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                        <i>Waiting for request to be accepted</i>
                                      </div>) : <Staff
                                      id={data.request_helper?.helper_profile?.helper_id}
                                      data={{
                                        photo: data.request_helper?.helper_profile?.helper_photo,
                                        firstname: data.request_helper?.helper_profile?.helper_firstname,
                                        lastname: data.request_helper?.helper_profile?.helper_lastname,
                                        staff_role: data.assignee_role,
                                      }}
                                    />}
                                  </div>
                                  <span
                                    className="border-right h-100 d-none d-lg-block"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                    }}
                                  ></span>
                                  <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                                    <b>Request Date</b>
                                    <div>{dateTimeFormatter(data.request_helper?.created_on)}</div>
                                    {data.task_type === "delivery" && (
                                      <div>
                                        <b>Fee : {toMoney(data.assignee_fee)}</b>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                  <i>No Helper Staff Yet</i>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    
                  </Card>
                      ) : view ? null : (data.status === "in_progress" || data.status === "rejected") && (data.request_helper?.status === "rejected") &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Assignee</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.assignee ? (
                          <>
                          <div
                            className="col-12 col-lg-6"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                          >
                            <Staff
                              id={data.assignee}
                              data={{
                                photo: data.assignee_photo,
                                firstname: data.assignee_name,
                                lastname: "",
                                staff_role: data.assignee_role,
                              }}
                            />
                          </div>
                          <span
                            className="border-right h-50 d-none d-lg-block"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                          ></span>
                          <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                            <b>Assigned by</b>
                            <div>
                              {data.assigned_by_name
                                ? data.assigned_by_name
                                : "Automatic Assignment"}
                            </div>
                            <div>{dateTimeFormatter(data.assigned_on)}</div>
                            {data.task_type === "delivery" && (
                              <div>
                                <b>Fee : {toMoney(data.assignee_fee)}</b>
                              </div>
                            )}
                          </div>
                          <div className="col-12 mt-4" >
                            <h5>Helper</h5>
                            <div
                              className="row no-gutters flex-wrap"
                              style={{ position: "relative" }} 
                            >
                              {data.assignee ? (
                                <>
                                  <div
                                    className="col-12 col-lg-6"
                                    style={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {(data.request_helper?.status === "ask_staff") ? (
                                      <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                        <i>Waiting for request to be accepted</i>
                                      </div>) : <Staff
                                      id={data.request_helper?.helper_profile?.helper_id}
                                      data={{
                                        photo: data.request_helper?.helper_profile?.helper_photo,
                                        firstname: data.request_helper?.helper_profile?.helper_firstname,
                                        lastname: data.request_helper?.helper_profile?.helper_lastname,
                                        staff_role: data.assignee_role,
                                      }}
                                    />}
                                  </div>
                                  <span
                                    className="border-right h-50 d-none d-lg-block"
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                    }}
                                  ></span>
                                  <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                                    <b>Request Date</b>
                                    <div>{dateTimeFormatter(data.request_helper?.created_on)}</div>
                                    {data.task_type === "delivery" && (
                                      <div>
                                        <b>Fee : {toMoney(data.assignee_fee)}</b>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-12" 
                                  style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                    <hr />
                                    <b>Reject Message</b>
                                    <p>{data.request_helper?.reject_message}</p>
                                  </div>
                                  </>
                              ) : (
                                <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                                  <i>No Helper Staff Yet</i>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Assigned Staff Yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    
                    {view ? null : (data.status === "rejected" ||
                        data.status === "created") && (data.request_delegate?.status !== "requested" && data.request_delegate?.status !== "rejected") && (data.request_helper?.status === "rejected") && (data.request_helper?.status !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                      <CardFooter>
                        <Button
                          onClick={() => setAssignHelper(true)}
                          icon={<FiUserPlus />}
                          label="Assign Helper"
                        />
                      </CardFooter>
                    ) : null
                    }
                    {view ? null : (data.status === "in_progress") && (data.request_delegate?.status !== "requested" || data.request_delegate?.status !== "rejected") && (data.request_helper?.status !== "rejected" || data.request_helper?.status === "requested") && (data.request_helper !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <CardFooter>
                          <Button
                            onClick={() => setAssignHelper(true)}
                            icon={<FiUserPlus />}
                            label="Accept"
                          />
                          <Button
                            color={ 'Danger'}
                            onClick={() => setRejectingHelper(true)}
                            label="Reject"
                          />
                        </CardFooter>
                    ) : null
                    }
                  </Card>
                      ) : null
                  }
                  {view ? null : (data.request_delegate?.status !== "approved") && (data.request_delegate !== null) && 
                  (data.request_helper?.status !== "requested") && (data.request_helper === null) &&
                  (role === "bm" ? canUpdate && canAdd : true) ? (
                  <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                    <CardBody>
                      <h5>Request Delegate</h5>
                      <div
                        className="row no-gutters flex-wrap"
                        style={{ position: "relative" }} 
                      >
                        {data.request_delegate ? (
                          <>
                            <div
                              className="col-12 col-lg-6"
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              <Staff
                                id={data.delegate_id}
                                data={{
                                  photo: data.assignee_photo,
                                  firstname: data.assignee_name,
                                  lastname: "",
                                  staff_role: data.assignee_role,
                                }}
                              />
                            </div>
                            <span
                              className="border-right d-none d-lg-block"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                              }}
                            ></span>
                            <div className="col-12 col-lg-6 mt-3 mt-lg-0 pl-0 pl-lg-3">
                              <div><b>Request Date</b></div>
                              {/* <div>{data.request_delegate?.status}</div> */}
                              {/* <div>{data.assigned_by_name
                                    ? data.assigned_by_name
                                    : "Automatic Assignment"}
                              </div> */}
                              <div>{dateTimeFormatter(data.request_delegate?.created_on)}</div>
                              {data.task_type === "delivery" && (
                                <div>
                                  <b>Fee : {toMoney(data.assignee_fee)}</b>
                                </div>
                              )}
                            </div>
                            <div className="col-12" 
                            style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                              <hr />
                              <p>{data.request_delegate?.message}</p>
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "rgba(0, 0, 0, 0.345)" }}>
                            <i>No Request Delegate yet</i>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {view ? null : (data.request_delegate?.status !== "approved" && data.request_delegate?.status !== "ask_staff") && (data.request_delegate !== null) &&
                      (role === "bm" ? canUpdate && canAdd : true) ? (
                        <div>
                          <CardFooter>
                            <Button
                              onClick={() => setDelegate(true)} 
                              label="Accept"
                            />
                            <Button
                              color={ 'Danger'}
                              onClick={() => setReject(true)}
                              label="Reject"
                            />
                          </CardFooter>
                      </div>
                    ) : null
                    }
                  </Card>
                      ) : null 
                  }
                  {data.task_type === "delivery" && (
                    <Card style={{ marginRight: "20px" }}>
                      <CardBody>
                        <CardTitle>
                          <h5>Disbursement</h5>
                        </CardTitle>
                        <Row>
                          <TwoColumn
                            first="Status :"
                            second={
                              <Pill
                                color={
                                  data.disbursement_details?.id
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {data.disbursement_details?.id
                                  ? "Disbursed"
                                  : "Undisbursed"}
                              </Pill>
                            }
                          />
                        </Row>
                        {data.disbursement_details?.id && (
                          <>
                            <Row>
                              <TwoColumn
                                first="Destination Bank :"
                                second={data.disbursement_details?.settled_bank?.toUpperCase()}
                              />
                            </Row>
                            <Row>
                              <TwoColumn
                                first="Destination Account :"
                                second={
                                  data.disbursement_details?.settled_account_no
                                }
                              />
                            </Row>
                            <Row>
                              <TwoColumn
                                first="Destination Account Name :"
                                second={
                                  data.disbursement_details
                                    ?.settled_account_name
                                }
                              />
                            </Row>
                            <Row>
                              <TwoColumn
                                first="Transfer Code :"
                                second={data.disbursement_details?.settled_code}
                              />
                            </Row>
                            <Row>
                              <TwoColumn
                                first="Disbursed at :"
                                second={dateTimeFormatter(
                                  data.disbursement_details?.created_on
                                )}
                              />
                            </Row>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  )}
                </Column>
              </Row>
            </Column>
          </>,
        ]}
      />
    </>
  );
}

export default Component;
