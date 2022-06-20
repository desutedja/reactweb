import React, { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "reactstrap";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Filter from "../../components/Filter";
import {
  getAnnoucement,
  setSelected,
  deleteAnnouncement,
} from "../slices/announcement";
import { dateTimeFormatterScheduler, toSentenceCase } from "../../utils";
import Template from "./components/Template";
import { endpointAdmin } from "../../settings";
import { get } from "../slice";

const cons = [
  "centratama",
  "management",
  "staff",
  "staff_courier",
  "staff_security",
  "staff_technician",
  "resident",
  "merchant",
];

const publisherRoles = [
  {value:"sa", label:"Super Admin"},
  {value:"gm_bm", label:"BM Manager"},
  {value:"pic_bm", label:"PIC Admin"}
];

function Component({ view, canAdd, canUpdate, canDelete }) {
  const [con, setCon] = useState("");
  const [publisherRole, setPublisherRole] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  const { role } = useSelector((state) => state.auth);

  const columns = [
    { Header: "ID", accessor: "id" },
    {
      Header: "Title",
      accessor: (row) => (
        <a href={"/" + role + "/announcement/" + row.id}>
          <b>{row.title}</b>
        </a>
      ),
    },
    {
      Header: "Publish Schedule",
      accessor: (row) => dateTimeFormatterScheduler(row.publish_schedule),
    },
    {
      Header: "Consumer",
      accessor: (row) => toSentenceCase(row.consumer_role.replace(/_/g, " ")),
    },
    {
      Header: "Publisher",
      accessor: (row) => (
        <>
          <a
            href={
              "/" +
              role +
              "/" +
              (row.publisher_role === "sa" ? "admin" : "staff") +
              "/" +
              row.publisher
            }
          >
            {row.publisher_name}
          </a>
        </>
      ),
    },
    {
      Header: "Publisher Role",
      accessor: (row) =>
        row.publisher_role === "sa" ? "Super Admin" 
        :
        row.publisher_role === "gm_bm" ? "BM Manager"
        : 
        "PIC Admin",
    },
    {
      Header: "Status",
      accessor: (row) =>
        row.publish ? (
          <h5>
            <Badge pill color="success">
              Published
            </Badge>
          </h5>
        ) : (
          <h5>
            <Badge pill color="secondary">
              Draft
            </Badge>
          </h5>
        ),
    },
  ];

  return (
    <Template
      view={view}
      columns={columns}
      slice="announcement"
      getAction={getAnnoucement}
      deleteAction={
        (role === "bm" ? canDelete : true) ? deleteAnnouncement : undefined
      }
      filterVars={[con, publisherRole.value]}
      filters={[
        {
          hidex: con === "",
          label: "Consumer: ",
          value: con ? toSentenceCase(con) : "All",
          delete: () => {
            setCon("");
          },
          component: (toggleModal) => (
            <Filter
              data={cons}
              onClick={(el) => {
                setCon(el);
                toggleModal(false);
              }}
              onClickAll={() => {
                setCon("");
                toggleModal(false);
              }}
            />
          ),
        },
        {
          hidex: publisherRole === "",
          label: "Publisher Role: ",
          value: publisherRole ? publisherRole.label : "All",
          delete: () => {
            setPublisherRole("");
          },
          component: (toggleModal) => (
            <Filter
              data={publisherRoles}
              onClick={(el) => {
                setPublisherRole(el);
                toggleModal(false);
              }}
              onClickAll={() => {
                setPublisherRole("");
                toggleModal(false);
              }}
            />
          ),
        },
      ]}
      actions={
        view
          ? null
          : (role === "bm" ? canAdd : true)
          ? [
              <Button
                key="Add Announcement"
                label="Add Announcement"
                icon={<FiPlus />}
                onClick={() => {
                  dispatch(setSelected({}));
                  history.push(url + "/add");
                }}
              />,
            ]
          : null
      }
    />
  );
}

export default Component;
