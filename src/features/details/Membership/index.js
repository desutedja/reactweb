import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ActivityLog from "./contents/ActivityLog";
import TemplateMembership from "../components/TemplateMembership";

import Modal from "../../../components/Modal";
import Pill from "../../../components/Pill";
import Table from "../../../components/Table";


import { useParams, useHistory } from "react-router-dom";
import {
  dateFormatter,
  toSentenceCase,
  ageFromBirthdate,
  dateTimeFormatterstriped,
} from "../../../utils";
import { get } from "../../slice";
import { endpointResident, kyccolor } from "../../../settings";
import { deleteResident, setSelected } from "../../slices/resident";


const reqMembershipColumns = [
  {
    Header: "ID",
    accessor: (row) => (
      // <Booking
      //   id={row.booking_id}
      //   data={row}
      //   items={[<b>{row.booking_number}</b>]}
      // />
      <b>{row.id}</b>
    ),
  },
  {
    Header: "Resident",
    accessor: (row) => "resident name",
  },
  {
    Header: "Resident Type",
    accessor: (row) => "Basic",
  },
  {
    Header: "Facility",
    accessor: (row) => <b>Yipy Gym</b>,
  },
  {
    Header: "Package - Period",
    accessor: (row) => <b>Platinum - 30 Day</b>,
  },
  {
    Header: "Status",
    accessor: (row) => (
      row.status === "Approved" ?
      <Pill color="primary">
        {toSentenceCase(row.status)}
      </Pill>
        :
      <Pill color="secondary">
        {toSentenceCase(row.status)}
      </Pill>
    ),
  },
  {
    Header: "Request Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.request_date ? dateTimeFormatterstriped(row.request_date) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },

  {
    Header: "Approved Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.approved_date ? dateTimeFormatterstriped(row.approved_date) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },
];

const membershipColumns = [
  {
    Header: "ID",
    accessor: (row) => (
      // <Booking
      //   id={row.booking_id}
      //   data={row}
      //   items={[<b>{row.booking_number}</b>]}
      // />
      <b>{row.id}</b>
    ),
  },
  {
    Header: "Resident",
    accessor: (row) => row.resident_name,
  },
  {
    Header: "Resident Type",
    accessor: (row) => "Basic",
  },
  {
    Header: "Facility",
    accessor: (row) => <b>Yipy Gym</b>,
  },
  {
    Header: "Package - Period",
    accessor: (row) => <b>Platinum - 30 Day</b>,
  },
  {
    Header: "Card Number",
    accessor: (row) => "123123123123123",
  },
  {
    Header: "Status",
    accessor: (row) => (
      row.status === "active" ?
      <Pill color="primary">
        {toSentenceCase(row.status)}
      </Pill>
        :
      <Pill color="secondary">
        {toSentenceCase(row.status)}
      </Pill>
    ),
  },
  {
    Header: "Due Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.due_date ? dateTimeFormatterstriped(row.due_date) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },
];

function Component({ view, canAdd, canUpdate, canDelete }) {

  const [loading, setLoading] = useState(false);

  const dataRequest = {
    "items": [
      {
        "id": 1,
        "resident_name":"User Satu",
        "resident_type" :"Basic",
        "facility_name": "Gym",
        "package":"Platinum",
        "period" :"30 Day",
        "status":"Booked",
        "request_date": "2023-08-01",
        "approved_date": null
      },
      {
        "id": 2,
        "resident_name":"User Dua",
        "resident_type" :"Basic",
        "facility_name": "Club House",
        "package":"Platinum",
        "period" :"30 Day",
        "status":"Approved",
        "request_date": "2023-08-01",
        "approved_date": "2023-08-01",
      }
    ],
    "total_items": 2,
    "filtered_page": 1,
    "total_pages": 1,
    "filtered_item": 10
  };

  const dataMember = {
    "items": [
      {
        "id": 1,
        "resident_name":"User Satu",
        "resident_type" :"Basic",
        "facility_name": "Gym",
        "package":"Platinum",
        "period" :"30 Day",
        "card_number": "12312312332",
        "status":"open",
        "due_date": "2023-08-01",
      },
      {
        "id": 2,
        "resident_name":"User Dua",
        "resident_type" :"Basic",
        "facility_name": "Club House",
        "package":"Platinum",
        "period" :"30 Day",
        "card_number": "78979787865",
        "status":"open",
        "due_date": "2023-08-01",
      }
    ],
    "total_items": 2,
    "filtered_page": 1,
    "total_pages": 1,
    "filtered_item": 10
  };
  
  // const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { role } = useSelector((state) => state.auth);

  const facility = [
    { label: "Club House", value: 1, },
    { label: "Gym", value: 2, },
  ]

  let dispatch = useDispatch();
  let { id } = useParams();
  let history = useHistory();


  return (
    <>
      <TemplateMembership
        image={"placeholder"}
        title={"activity"}
        pagetitle="Activity"
        email={""}
        phone={""}
        reason={""}
        loading={false}
        labels={["Request Member", "Data Member"]}
        activeTab={0}
        facility={facility}
        contents={[
          <Table
              columns={reqMembershipColumns}
              data={dataRequest?.items || []}
              loading={loading}
              onClickApproved={
                (row) => {
                  console.log("ROWWW:", row)
                }
              }
              onClickDisapproved={
                (row) => {
                  console.log("ROWWW:", row)
                }
              }
            />,
            <Table
              columns={membershipColumns}
              data={dataMember?.items || []}
              loading={loading}
            />,
          // <ActivityLog
          //   canAdd={role === "bm" ? canAdd : true}
          //   canDelete={role === "bm" ? canDelete : true}
          //   canUpdate={role === "bm" ? canUpdate : true}
          //   view={view}
          //   id={id}
          // />,
        ]}
      />
    </>
  );
}

export default Component;
