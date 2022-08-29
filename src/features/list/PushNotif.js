import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toSentenceCase } from "../../utils";
import { get, setConfirmDelete, post, del } from "../slice";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import PushNotif from "../../components/cells/PushNotif";
import { setSelected } from "../slices/userRequest";
import Badge from "../../components/Badge";
import Filter from "../../components/Filter";
import { endpointNotification } from "../../settings";

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
  { label: "Waiting for Approval", value: "wfa" },
  { label: "Waiting for Pickup", value: "wfp" },
  { label: "On Process", value: "on_process" },
  { label: "Done", value: "done" },
  { label: "Rejected", value: "rejected" },
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
                : "warning text-white"
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
              <small style={{ color: "#C4C4C4" }}>{row.description}</small>
            </div>
          </>,
        ]}
      />
    ),
  },
  {
    Header: "Filters",
    accessor: (row) => {
      return (
        <div>
          {row.filter}
          {/* {row.filters.map((item) => (
            <div>
              {(item.building_name &&
              !item.age_from &&
              !item.gender &&
              !item.billing
                ? "Building"
                : item.building_name && item.age_from
                ? "Building, "
                : item.building_name && item.gender
                ? "Building, "
                : item.building_name && item.billing
                ? "Building, "
                : []) +
                (item.age_from && !item.gender && !item.billing
                  ? "Age"
                  : item.age_from && item.gender
                  ? "Age, "
                  : item.age_from && item.billing
                  ? "Age, "
                  : []) +
                (item.gender && !item.billing
                  ? "Gender"
                  : item.gender && item.billing
                  ? "Gender, "
                  : []) +
                (item.billing ? "Billing" : [])}
            </div>
          ))} */}
        </div>
      );
    },
  },
  {
    Header: "Deliveries",
    accessor: (row) => {
      return <div>{row.remarks}</div>;
    },
  },
];

function Component({ view, title = "", pagetitle }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");
  const [subCat, setSubCat] = useState("");
  const [subCatName, setSubCatName] = useState("");
  const [stat, setStat] = useState("");
  const [statName, setStatName] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  const { refreshToggle } = useSelector((state) => state["userRequest"]);

  return (
    <>
      <h2 style={{ marginLeft: "16px" }}>{pagetitle}</h2>
      <Breadcrumb title={title} />
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
            [dispatch, cat, subCat, stat, refreshToggle]
          )}
          loading={loading}
          onClickEdit={
            view
              ? null
              : (row) => {
                  dispatch(setSelected(row));
                  history.push(url + "/edit");
                  console.log(row);
                }
          }
          onClickDelete={
            view
              ? null
              : (row) => {
                  dispatch(
                    setConfirmDelete(
                      "Are you sure you want to delete this user request?",
                      // "Feature still under development",
                      () => {
                        // dispatch(deleteUserRequest(row, history));
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
                <p>{"Category: " + (cat ? toSentenceCase(catName) : "All")}</p>
              ),
              hidex: cat === "",
              delete: () => setCat(""),
              component: (toggleModal) => (
                <>
                  <Filter
                    data={listCate}
                    onClick={(el) => {
                      setCat(el.value);
                      setCatName(el.label);
                      setSubCat("");
                      setSubCatName("");
                      toggleModal(false);
                    }}
                    onClickAll={() => {
                      setCat("");
                      setCatName("");
                      setSubCat("");
                      setSubCatName("");
                      toggleModal(false);
                    }}
                  />
                </>
              ),
            },
            ...(cat && cat != 3
              ? [
                  {
                    label: (
                      <p>
                        {"Sub Category: " +
                          (subCat ? toSentenceCase(subCatName) : "All")}
                      </p>
                    ),
                    hidex: subCat === "",
                    delete: () => setSubCat(""),
                    component: (toggleModal) => (
                      <>
                        <Filter
                          data={cat === 1 ? subBilling : subAccount}
                          onClick={(el) => {
                            setSubCat(el.value);
                            setSubCatName(el.label);
                            toggleModal(false);
                          }}
                          onClickAll={() => {
                            setSubCat("");
                            setSubCatName("");
                            toggleModal(false);
                          }}
                        />
                      </>
                    ),
                  },
                ]
              : []),
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
