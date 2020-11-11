import React, { useState } from "react";
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
import { toSentenceCase } from "../../utils";
import Template from "./components/Template";

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

function Component({ view, canAdd, canUpdate, canDelete }) {
  const [con, setCon] = useState("");

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
        row.publisher_role === "sa" ? "Super Admin" : "PIC Admin",
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
      filterVars={[con]}
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
