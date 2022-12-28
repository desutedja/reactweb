import React, { useState, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dateFormaterEx, dateFormatter, toSentenceCase } from "../../../../utils";
import { get, setConfirmDelete } from "../../../slice";

import Table from "../../../../components/Table";
import Breadcrumb from "../../../../components/Breadcrumb";
import { FiPlus } from "react-icons/fi";

import Button from "../../../../components/Button";
import PushNotif from "../../../../components/cells/PushNotif";
import Badge from "../../../../components/Badge";
import Filter from "../../../../components/Filter";
import { endpointNotification } from "../../../../settings";
import { activatePushNotif, deletePushNotif, inActivatePushNotif, setSelected } from "../../../slices/pushnotification";

const listCate = [
  { label: "Billing", value: 1 },
  { label: "Account", value: 2 },
  { label: "Others", value: 3 },
];

const subBilling = [
  { label: "Paid/Unpaid", value: 1 },
  { label: "Hilangkan Denda", value: 2 },
  { label: "Hapus Billing Item", value: 3 },
];

const subAccount = [
  { label: "Tidak menerima OTP", value: 4 },
  { label: "Tidak bisa Upgrade Permium User", value: 5 },
];

const listStat = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Ended", value: "ended" },
  { label: "Draft", value: "draft" },
];

const columns = [
  {
    Header: "Status",
    accessor: (row) => {
      return (
        <div>
          <Badge
            color={
              row.status === "draft"
                ? "secondary"
                : row.status === "inactive"
                ? "info"
                : row.status === "ended"
                ? "danger"
                : row.status === "active"
                ? "success"
                : "info text-white"
            }
          >
            {toSentenceCase(row.status)}
          </Badge>
        </div>
      );
    },
  },
  {
    Header: "Name/Message",
    accessor: (row) => (
      <PushNotif
        id={row.id}
        data={row}
        items={[
          <>
            <div>
              <b style={{ fontSize: 14 }}>{row.title}</b>
              <br />
              {/* <small style={{ color: "#C4C4C4" }}>
                {toSentenceCase(row.remarks)}
              </small> */}
              <small style={{ color: "#C4C4C4" }}>
                {row.remarks === "once"
                  ? toSentenceCase(row.remarks) +
                    ", " +
                    dateFormaterEx(row.schedule_start) +
                    " at " +
                    (row.schedule_time ? row.schedule_time : "12:00")
                  : row.remarks === "daily" || row.remarks === "weekly"
                  ? toSentenceCase(row.remarks) +
                    " recurring at " +
                    (row.schedule_time ? row.schedule_time : "12:00") +
                    " from " +
                    dateFormaterEx(row.schedule_start) +
                    " to " +
                    dateFormaterEx(row.schedule_end)
                  : row.remarks === "h-3"
                  ? "Due Date Billing H-3"
                  : row.remarks === "h-1"
                  ? "Due Date Billing H-1"
                  : row.remarks === "h-h"
                  ? "Due Date Billing H-H"
                  : "Send as soon as campaign is launched."}
              </small>
            </div>
          </>,
        ]}
      />
    ),
  },
  {
    Header: "Filters",
    accessor: (row) => {
      return <div>{toSentenceCase(row.filter)}</div>;
    },
  },
  // {
  //   Header: "Deliveries",
  //   accessor: (row) => {
  //     return <div>{row.deliveries ? row.deliveries : "-"}</div>;
  //   },
  // },
];

function Component({ view, title = "" }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });

  const [stat, setStat] = useState("");
  const [statName, setStatName] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  const { refreshToggle } = useSelector((state) => state["pushnotification"]);

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">Push Notification List</h2>
      <div className="Container">
        <Table
          columns={columns}
          data={data?.items || []}
          fetchData={useCallback(
            (page, limit, searchItem, sortField, sortType) => {
              setLoading(true);
              dispatch(
                get(
                  endpointNotification +
                    "/pushnotif?page=" +
                    (page + 1) +
                    "&limit=" +
                    limit +
                    "&filter=" +
                    stat +
                    "&search=" +
                    searchItem,
                  (res) => {
                    console.log(res.data.data);
                    setData(res.data.data);
                    setLoading(false);
                  }
                )
              );
            },
            [dispatch, stat, refreshToggle]
          )}
          loading={loading}
          // onClickEdit={
          //   view
          //     ? null
          //     : (row) => {
          //         dispatch(setSelected(row));
          //         history.push(url + "/edit");
          //         console.log(row);
          //       }
          // }
          onClickActive={
            view
              ? null
              : (row) => {
                  dispatch(
                    setConfirmDelete(
                      <>
                        Are you sure you want to set this notification to <b>Active</b>?
                      </>,
                      () => {
                        console.log(row.id);
                        dispatch(activatePushNotif(row.id, history));
                      }
                    )
                  );
                }
          }
          onClickInactive={
            view
              ? null
              : (row) => {
                  dispatch(
                    setConfirmDelete(
                      <>
                        Are you sure you want to set this notification to <b>Inactive</b>?
                      </>,
                      () => {
                        console.log(row.id);
                        dispatch(inActivatePushNotif(row.id, history));
                      }
                    )
                  );
                }
          }
          onClickDelete={
            view
              ? null
              : (row) => {
                  dispatch(
                    setConfirmDelete(
                      "Are you sure you want to delete this notification?",
                      () => {
                        console.log(row.id);
                        dispatch(deletePushNotif(row, history));
                      }
                    )
                  );
                }
          }
          actions={
            view
              ? null
              : [
                  <Button
                    key="Create New"
                    label="Create New"
                    icon={<FiPlus />}
                    onClick={() => {
                      dispatch(setSelected({}));
                      history.push(url + "/add");
                    }}
                  />,
                ]
          }
          pageCount={data?.total_pages}
          totalItems={data?.filtered_item}
          filters={[
            {
              label: (
                <p>{"Status: " + (stat ? toSentenceCase(statName) : "All")}</p>
              ),
              hidex: stat === "",
              delete: () => setStat(""),
              component: (toggleModal) => (
                <>
                  <Filter
                    data={listStat}
                    onClick={(el) => {
                      setStat(el.value);
                      setStatName(el.label);
                      toggleModal(false);
                    }}
                    onClickAll={() => {
                      setStat("");
                      setStatName("");
                      toggleModal(false);
                    }}
                  />
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}

export default Component;
