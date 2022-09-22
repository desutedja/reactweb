import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import TemplatePushNotif from "../../../features/details/components/TemplatePushNotif";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../slice";
import { endpointNotification } from "../../../settings";
import { setSelected } from "../../slices/pushnotification";
import parse from "html-react-parser";
import { dateFormatter, dateTimeFormatter, toSentenceCase } from "../../../utils";
import Button from "../../../components/Button";
import { FiEdit } from "react-icons/fi";

function Component({ view, editPath = "edit" }) {
  const [data, setData] = useState({});
  const [content, setContent] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointNotification + "/pushnotif/detail?id=" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        setContent(res.data.data.content);
      })
    );
  }, [id, dispatch]);

  return (
    <>
      <TemplatePushNotif
        loading={!data.id}
        image={data.image || "placeholder"}
        link={data.link_url}
        pagetitle="Push Notif Information"
        // contents={[<DetailPushNotif view={view} data={data} labels={info} />]}
        contents={[
          <>
            <div
              className="row no-gutters w-100"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                {/* Information Section */}
                <div
                  style={{
                    marginBottom: 16,
                    marginRight: 30,
                  }}
                >
                  <div
                    style={{
                      color: "#5A5A5A",
                      paddingBottom: 8,
                      borderBottom: "2px solid #C4C4C4",
                      width: 200,
                      marginBottom: 24,
                      marginLeft: 4,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Information
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Push Notification ID
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.id}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Created On
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.created_on ? dateTimeFormatter(data.created_on) : "-"}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Status
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {toSentenceCase(data.status)}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Title
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.title}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Caption
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.body}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Content
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {parse(content)}
                    </div>
                  </div>
                </div>
                {/* Information Section */}

                {/* Filters Section */}
                <div
                  style={{
                    marginBottom: 16,
                    marginRight: 30,
                  }}
                >
                  <div
                    style={{
                      color: "#5A5A5A",
                      paddingBottom: 8,
                      borderBottom: "2px solid #C4C4C4",
                      width: 200,
                      marginBottom: 24,
                      marginLeft: 4,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Filters
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Filter
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {toSentenceCase(data.filter)}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Age
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.age_from && data.age_to
                        ? data.age_from + " - " + data.age_to + " years"
                        : "-"}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Building
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.building_name ? data.building_name : "-"}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Gender
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.gender === "L"
                        ? "Laki-laki"
                        : data.gender === "P"
                        ? "Perempuan"
                        : "-"}
                    </div>
                  </div>
                  <div
                    className="row no-gutters"
                    style={{ padding: "4px", alignItems: "flex-start" }}
                  >
                    <div
                      className="col-auto"
                      flex={3}
                      style={{
                        fontWeight: "bold",
                        textAlign: "left",
                        minWidth: 200,
                      }}
                    >
                      Billing
                    </div>
                    <div
                      className="col"
                      flex={9}
                      style={{ fontWeight: "normal" }}
                    >
                      {data.billing ? toSentenceCase(data.billing) : "-"}
                    </div>
                  </div>
                </div>
                {/* Filter Section */}

                {/* Schedule Section */}
                <div
                  style={{
                    marginBottom: 16,
                    marginRight: 30,
                  }}
                >
                  <div
                    style={{
                      color: "#5A5A5A",
                      paddingBottom: 8,
                      borderBottom: "2px solid #C4C4C4",
                      width: 200,
                      marginBottom: 24,
                      marginLeft: 4,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Schedule
                  </div>
                  {data.remarks === "once" && (
                    <>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Scheduling Options
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          Set at designated time
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Set Delivery Schedule
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {toSentenceCase(data.remarks)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Send On
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {dateFormatter(data.schedule_start)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          At Time
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {data.schedule_time + " WIB"}
                        </div>
                      </div>
                    </>
                  )}
                  {data.remarks === "daily" && (
                    <>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Scheduling Options
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          Set at designated time
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Set Delivery Schedule
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {toSentenceCase(data.remarks)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Starts On
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {dateFormatter(data.schedule_start)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Ends On
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {dateFormatter(data.schedule_end)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          At Time
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {data.schedule_time + " WIB"}
                        </div>
                      </div>
                    </>
                  )}
                  {data.remarks === "weekly" && (
                    <>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Scheduling Options
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          Set at designated time
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Set Delivery Schedule
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {toSentenceCase(data.remarks)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Set Delivery Schedule
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {data.day
                            ? data.day === 1
                              ? "Sunday"
                              : data.day === 2
                              ? "Monday"
                              : data.day === 3
                              ? "Tuesday"
                              : data.day === 4
                              ? "Wednesday"
                              : data.day === 5
                              ? "Thurstday"
                              : data.day === 6
                              ? "Friday"
                              : "Saturday"
                            : "-"}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Starts On
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {dateFormatter(data.schedule_start)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Ends On
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {dateFormatter(data.schedule_end)}
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          At Time
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {data.schedule_time + " WIB"}
                        </div>
                      </div>
                    </>
                  )}
                  {data.is_schedule === false && data.due_date === null && (
                    <>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Scheduling Options
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          Send as soon as campaign is launched
                        </div>
                      </div>
                    </>
                  )}
                  {data.due_date !== null && (
                    <>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Scheduling Options
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          Due Date Billing
                        </div>
                      </div>
                      <div
                        className="row no-gutters"
                        style={{ padding: "4px", alignItems: "flex-start" }}
                      >
                        <div
                          className="col-auto"
                          flex={3}
                          style={{
                            fontWeight: "bold",
                            textAlign: "left",
                            minWidth: 200,
                          }}
                        >
                          Day
                        </div>
                        <div
                          className="col"
                          flex={9}
                          style={{ fontWeight: "normal" }}
                        >
                          {data.due_date
                            ? data.due_date === 0
                              ? "H-H Due Date"
                              : data.due_date === 1
                              ? "H-1 Due Date"
                              : data.due_date === 3
                              ? "H-3 Due Date"
                              : []
                            : "-"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* Schedule Section */}
              </div>
              {
                <div className="col-auto d-flex flex-column">
                  {
                    <Button
                      icon={<FiEdit />}
                      label="Edit"
                      onClick={() =>
                        history.push({
                          pathname: editPath,
                          // state: data,
                        })
                      }
                    />
                  }
                </div>
              }
            </div>
          </>,
        ]}
      />
    </>
  );
}

export default Component;
