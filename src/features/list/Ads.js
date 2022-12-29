import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Filter from "../../components/Filter";
import AgeRangeInput from "../../components/AgeRangeInput";
import { FiPlus } from "react-icons/fi";
import { osType, genders, toSentenceCase, days, daysLabel } from "../../utils";

import moment from "moment";
import Pill from "../../components/Pill";
import Button from "../../components/Button";

import Template from "./components/Template";
import { getAds, deleteAds, setSelected } from "../slices/ads";
import { dateTimeFormatterCell } from "../../utils";
import AdsCell from "../../components/cells/Ads";

const columnsBM = [
  { Header: "ID", accessor: "id" },
  { Header: "Title", accessor: (row) => <AdsCell id={row.id} data={row} /> },
  { Header: "Gender", accessor: (row) => (row.gender ? row.gender : "All") },
  { Header: "Age", accessor: (row) => row.age_from + " - " + row.age_to },
  {
    Header: "Status",
    accessor: (row) =>
      row.published ? (
        moment().isBefore(moment(row.end_date.slice(0, -1))) ? (
          <Pill color="success">Published</Pill>
        ) : (
          <Pill color="danger">Ended</Pill>
        )
      ) : (
        <Pill color="secondary">Draft</Pill>
      ),
  },
  { Header: "Platform", accessor: (row) => (row.os ? row.os : "All") },
  {
    Header: "Occupation",
    accessor: (row) =>
      row.occupation ? toSentenceCase(row.occupation) : "All",
  },
  { Header: "Weight", accessor: "total_priority_score" },
  {
    Header: "Start Date",
    accessor: (row) => dateTimeFormatterCell(row.start_date),
  },
  {
    Header: "End Date",
    accessor: (row) => dateTimeFormatterCell(row.end_date),
  },
];

const columnsSA = [
  ...columnsBM,
  {
    Header: "Created By",
    accessor: (row) =>
      row.bm_ad_building_id ? row.bm_ad_building_name : "Centratama",
  },
];

function Component({ view }) {
  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  const [os, setOs] = useState("");
  const [ageFrom, setAgeFrom] = useState("10");
  const [ageTo, setAgeTo] = useState("85");
  const [gender, setGender] = useState("");
  const [day, setDay] = useState("");
  const { role, user } = useSelector((state) => state.auth);
  const { group } = user;

  const saFilter = [
    os.toLowerCase(),
    gender[0],
    ageFrom.toLowerCase(),
    ageTo.toLowerCase(),
    day,
  ];

  const advertiserFilter = [
    os.toLowerCase(),
    gender[0],
    ageFrom.toLowerCase(),
    ageTo.toLowerCase(),
    day,
    user.id,
  ];

  useEffect(() => {
    console.log(os, gender, ageFrom);
  }, [os, gender, ageFrom]);

  return (
    <Template
      view={view}
      pagetitle="Advertisement List"
      columns={role === "sa" ? columnsSA : columnsBM}
      slice={"ads"}
      getAction={getAds}
      deleteAction={deleteAds}
      sortBy={["start_date", "end_date", "published"]}
      actions={
        view
          ? null
          : group === "vas_advertiser" || role === "bm"
          ? null
          : [
              <Button
                key="Add Advertisement"
                label="Add Advertisement"
                icon={<FiPlus />}
                onClick={() => {
                  dispatch(setSelected({}));
                  history.push(url + "/add");
                }}
              />,
            ]
      }
      filterVars={group === "vas_advertiser" ? advertiserFilter : saFilter}
      filters={[
        {
          hidex: day === "",
          label: <p>{day ? "Day: " + days[day - 1] : "Day: All"}</p>,
          delete: () => setDay(""),
          component: (toggleModal) => (
            <Filter
              data={daysLabel}
              onClick={(el) => {
                setDay(el.value);
                toggleModal(false);
              }}
              onClickAll={() => {
                setDay("");
                toggleModal(false);
              }}
            />
          ),
        },
        {
          hidex: os === "",
          label: <p>{os ? "OS: " + os : "OS: All"}</p>,
          delete: () => setOs(""),
          component: (toggleModal) => (
            <Filter
              data={osType}
              onClick={(el) => {
                setOs(el.value);
                toggleModal(false);
              }}
              onClickAll={() => {
                setOs("");
                toggleModal(false);
              }}
            />
          ),
        },
        {
          hidex: gender === "",
          label: <p>{gender ? "Gender: " + gender : "Gender: All"}</p>,
          delete: () => setGender(""),
          component: (toggleModal) => (
            <Filter
              data={genders}
              onClick={(el) => {
                setGender(el.value);
                toggleModal(false);
              }}
              onClickAll={() => {
                setGender("");
                toggleModal(false);
              }}
            />
          ),
        },
        {
          hidex: ageFrom === "10" && ageTo === "85",
          label: (
            <p>
              {ageFrom === "10" && ageTo === "85"
                ? "Ages: Any"
                : "Ages: " + ageFrom + " - " + ageTo}
            </p>
          ),
          delete: () => {
            setAgeFrom("10");
            setAgeTo("85");
          },
          component: (toggleModal) => (
            <AgeRangeInput
              start={ageFrom}
              end={ageTo}
              setStart={setAgeFrom}
              setEnd={setAgeTo}
              toggle={toggleModal}
            />
          ),
        },
      ]}
    />
  );
}

export default Component;
