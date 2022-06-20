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
import UserRequester from "../../../components/cells/UserRequester";
import Staff from "../../../components/cells/Staff";
import Column from "../../../components/Column";
import TwoColumn from "../../../components/TwoColumn";
import Pill from "../../../components/Pill";
import { dateTimeFormatter, toSentenceCase, toMoney } from "../../../utils";
import { MdChatBubble } from "react-icons/md";
import { FiCheck, FiUserPlus } from "react-icons/fi";

import Button from "../../../components/Button";
import Filter from "../../../components/Filter";
import Modal from "../../../components/Modal";

import { Form } from "reactstrap";
import { Input } from "reactstrap";
import SubmitButton from "../../form/components/SubmitButton";

import Template from "../components/Template";

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
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0 }}>
                    <CardHeader style={{ background: "transparent" }}>
                      <TwoColumn
                        first={"Unpaid billing karna ada kesalahan"}
                        second={
                          " "
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
                          <h5>Description</h5>
                        </CardTitle>
                      </Row>
                      <div style={{ display: "column", lineHeight: "1.5em" }}>
                        <div>
                          <small style={{ fontSize: 14 }}>
                            Ada kesalahan saat melakukan pembayaran. Berikut ID billing yang akan di unpaid: 
                            <ul>
                              <li>
                                5002 - Wing FSI 0106
                              </li>
                              <li>
                                1232 - Wing FSI 1293
                              </li>
                              <li>
                                5002 - Wing FSI 0106
                              </li>
                              <li>
                                5002 - Wing FSI 0106
                              </li>
                            </ul>
                            Mohon sgera dilakukan unpaid billing ya dikarenakan urgent, terima kasih.
                          </small>
                        </div>
                        {/* <div style={{ color: "rgba(0, 0, 0, 0.768)" }}>
                          {data.description || <i>No Description</i>}
                        </div> */}
                      </div>
                      <div style={{ display: "column", lineHeight: "2.5em", marginTop: 10 }}>
                        <h5>Attachment</h5>
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
                </Column>
                <Column
                  style={{ flex: "4", display: "block", maxWidth: "700px" }}
                >
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0}}>
                    <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={"Status"}
                        second={
                          <div>
                            {/* <Pill color={taskPriorityColor[data.priority]}>
                              {toSentenceCase(data.priority) + " Priority"}
                            </Pill> */}
                            <Pill color={"secondary"}>
                              {"Waiting for Approval"}
                            </Pill>
                          </div>
                        }
                      />
                    </CardHeader>
                    <CardBody>
                      <div style={{ display: "column", lineHeight: "1.5em" }}>
                        <div>
                          <small style={{ fontSize:14 }}>
                            Approved by: Admin, {dateTimeFormatter(data.created_on)}
                            <br />
                            Created on: {dateTimeFormatter(data.created_on)} by System
                          </small>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0}}>
                    <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={"Details"}
                        second={" "}
                      />
                    </CardHeader>
                    <CardBody>
                      <div style={{ display: "column", lineHeight: "2em" }}>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20}}>
                            Priority
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14 }}>
                              High
                            </small>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20}}>
                            Category
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14 }}>
                              Billing
                            </small>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20}}>
                            Sub Category
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14 }}>
                              Unpaid Billing
                            </small>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20}}>
                            Requester
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14 }}>
                              <UserRequester
                                id={data.requester}
                                data={{
                                  id: data.requester,
                                  photo: data.resident_photo,
                                  firstname: data.requester_name,
                                  lastname: "",
                                }}
                              />
                            </small>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter style={{ background:"transparent" }}>
                    <div style={{ display: "column", lineHeight: "2em", display: "flex", justifyContent: "center" }}>
                        <div className="row">
                          <div className="col" style={{ paddingLeft:20 }}>
                              <Button
                                color="Danger"
                                // onClick={() => setAssign(true)}
                                label="Reject"
                              />
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14 }}>
                              
                              <Button
                                // onClick={() => setAssign(true)}
                                label="Approve"
                              />
                            </small>
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
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
