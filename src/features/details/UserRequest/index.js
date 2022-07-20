import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Row from "../../../components/Row";
import UserRequester from "../../../components/cells/UserRequester";
import Column from "../../../components/Column";
import TwoColumn from "../../../components/TwoColumn";
import Pill from "../../../components/Pill";
import { dateTimeFormatter, toSentenceCase, toMoney } from "../../../utils";

import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

import Template from "../components/Template";

import { Card, CardHeader, CardFooter, CardTitle, CardBody } from "reactstrap";

import { useParams } from "react-router-dom";
import { get } from "../../slice";
import parse from "html-react-parser"
import { setSelected } from "../../slices/userRequest";
import {
  endpointUserRequest,
} from "../../../settings";

function UserRequest({ view, canUpdate, canAdd, canDelete }) {
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState("");
  const [data, setData] = useState({});

  const { refreshToggle } = useSelector((state) => state.userRequest);

  let dispatch = useDispatch();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointUserRequest + "/data?request_id=" + id, (res) => {
        setData(res.data.data);
      })
    );
  }, [dispatch, id, refreshToggle]);

  return (
    <>
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

      <Template
        transparent
        loading={!data.id}
        labels={["Details"]}
        contents={[
          <>
            <Column style={{ width: "100%" }}>
              <Row>
              {/* Column Description and Attachments */}
                <Column style={{ flex: "6", display: "block" }}>
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0 }}>
                    <CardHeader style={{ background: "transparent" }}>
                      <TwoColumn
                        first={
                          <div>
                            <b>{data.title}</b>
                          </div>
                        }
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
                            {data.description !== "" ?
                              parse(data.description || "")
                              :
                              <i>No Description</i>
                            }
                          </small>
                        </div>
                      </div>
                      <div style={{ display: "column", lineHeight: "2.5em", paddingTop: 18 }}>
                        <h5>Attachment</h5>
                          {data.attachments?.length > 0 && (
                            data.attachments.map((el, index) =>
                            (el.url != "" ?
                              ( //
                                <img
                                  src={el.url}
                                  alt="attachment"
                                  onClick={() => {
                                    setModal(true);
                                    setImage(el.url);
                                  }}
                                  style={{
                                    height: 80,
                                    aspectRatio: 1,
                                    marginRight: 8,
                                  }}
                                />
                              )
                              : 
                              (
                                <div
                                  style={{
                                    color: "silver",
                                  }}
                                >
                                  <i>No Attachment</i>
                                </div>
                              )
                            ))
                          )}
                      </div>
                    </CardBody>
                  </Card>
                </Column>
              {/* Column Status and Details */}
                <Column
                  style={{ flex: "4", display: "block", maxWidth: "700px" }}
                >
              {/* Status Section */}
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0}}>
                    <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={
                          <div>
                            <b>Status</b>
                          </div>
                        }
                        second={
                          <div>
                            <Pill color={data.status === 'wfa' ? 'secondary' 
                            :
                              data.status === 'wfp' ? 'info' 
                            :
                              data.status === 'on_process' ? 'warning text-white'
                            : 
                              data.status === 'done' ? 'success' 
                            : 
                            'danger' 
                            }
                            >
                              {
                              data.status === 'wfa' ? "Waiting for Approval"
                              :
                              data.status === 'wfp' ? "Waiting for Pickup"
                              :
                              toSentenceCase(data.status)
                              }
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
                            Created on: {dateTimeFormatter(data.created_on)} by {data.created_by_name}
                          </small>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
              {/* Details Section */}
                  <Card style={{ marginRight: "20px", marginBottom: "20px", borderRadius: 10, border: 0}}>
                    <CardHeader style={{ background: "Transparent" }}>
                      <TwoColumn
                        first={
                          <div>
                            <b>Details</b>
                          </div>
                        }
                        second={" "}
                      />
                    </CardHeader>
                    <CardBody>
                      <div style={{ display: "column", lineHeight: "2em" }}>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20, fontWeight: 500}}>
                            Category
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14, fontWeight: 400 }}>
                              {toSentenceCase(data.category_name) || "-"}
                            </small>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20, fontWeight: 500}}>
                            Sub Category
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14, fontWeight: 400 }}>
                              {toSentenceCase(data.sub_category_name) || "-"}
                            </small>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col" style={{paddingLeft:20, fontWeight: 500}}>
                            Requester
                          </div>
                          <div className="col">
                            <small style={{ fontSize: 14, fontWeight: 400 }}>
                              {data.requester === undefined ? "-" :
                              <UserRequester
                                id={data.requester}
                                data={{
                                  id: data.requester,
                                  photo: data.resident_photo,
                                  firstname: data.requester_name,
                                  lastname: "",
                                }}
                              />
                              }
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

export default UserRequest;
