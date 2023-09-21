import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dateTimeFormatterstriped,
  toSentenceCase,
  inputDateTimeFormatter24
} from "../../utils";
import { endpointAdmin,endpointBookingFacility } from "../../settings";
import { get, setConfirmDelete, post, del, getWithHeader } from "../slice";

import { deleteFacility } from "../slices/facility";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Pill from "../../components/Pill";
import { setSelected } from "../slices/facility";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Tab from "../../components/Tab";
import Filter from "../../components/Filter";
import Facilities from "../../components/cells/Facilities";
import { FiSearch } from "react-icons/fi";

import Modal from "../../components/Modal";
// import { auth } from "firebase";

const columnsUnit = [
  { Header: "ID", accessor: "id" },
  { Header: "Resident", accessor: "resident_name" },
  { Header: "Facility", accessor: "facility_name" },
  { Header: "Card Number", accessor: "membership_card_number" },
  { Header: "Tap In Time", accessor: (row) => row.created_on ? inputDateTimeFormatter24(row.created_on) : "-" },
  { Header: "Status", accessor: "status"}
];

const data = {
  "data": [
    {
      "id": 2,
      "resident_name":"User Satu",
      "facility_name": "Gym",
      "membership_card_number": "1231263190",
      "created_on": "2023-08-01 13:11:32",
      "status":"check-out"
    },
    {
      "id": 1,
      "resident_name":"User Satu",
      "facility_name": "Gym",
      "membership_card_number": "1231263190",
      "created_on": "2023-08-01 15:24:23",
      "status":"check-in"
    },
  ],
  "total_items": 2,
  "filtered_page": 1,
  "total_pages": 1,
  "filtered_item": 10
};


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

const listBookingStat = [
  { label: "Booked", value: "1" },
  { label: "Check-In", value: "2" },
  { label: "Check-Out", value: "3" },
  { label: "Canceled", value: "4" },
];

const listFacilities = [
  { label: "Gym", value: "gym" },
  { label: "Pool", value: "pool" },
  { label: "Restaurant", value: "restaurant" },
];

const listFacStat = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

function Component({ view, title = "", pagetitle, canAdd, canDelete }) {
 
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState({ items: [] });
  const [dataBooking, setDataBooking] = useState({ items: [] });
  const [status, setStatus] = useState("");
  const [building, setBuilding] = useState("");
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");
  const [toggle, setToggle] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const { auth } = useSelector((state) => state);
  const [buildingLabel, setBuildingLabel] = useState("");
  const [buildingList, setBuildingList] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const tabs = ["Log"];
  const [stat, setStat] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [data2, setData] = useState(data);

  const [openModal, setOpenModal] = useState(false);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  dispatch(
    get(endpointAdmin + "/access/log", (res) => {
      setData(res.data);
    })
  );

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

            setBuildingList(formatted);
          }
        )
      );
  }, [dispatch, search, limit]);

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">Membership</h2>
      <div className="Container">
        <Modal
          isOpen={openModal}
          toggle={() => {
            setOpenModal(false);
          }}
          title="Activation Membership"
          okLabel={"Yes, Confirm"}
          onClick={() => {
            // dispatch();
            setOpenModal(false);
          }}
        >

          <Input
                label="Schedule Activated"
                type="date"
                // inputValue={from}
                // setInputValue={setFrom}
              />

            <Input
              label="Card Number"
              placeholder={"Tap the card on the card reader"}
              type="text"
            />
        </Modal>
        <Tab
          labels={tabs}
          setTab={setType}
          activeTab={0}
          contents={[
            <Table
              titleList={"Log Activity"}
              totalItems={"10"}
              noContainer={true}
              columns={columnsUnit}
              data={data2.data}
              loading={false}
              pageCount={"10"}
              fetchData={useCallback(
                () => {
                  dispatch(
                    get(endpointAdmin + "/access/log", (res) => {
                      setData(res.data);
                      console.log("DATA:", data2)
                    })
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch]
              )}
              filters={[]}
            />,
          ]}
        />
      </div>
    </>
  );
}

export default Component;
