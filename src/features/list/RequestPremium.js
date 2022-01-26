import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pill from "../../components/Pill";
import Loading from "../../components/Loading";
import Filter from "../../components/Filter";

import { toSentenceCase } from "../../utils";

import TemplateRequestPremium from "./components/TemplateRequestPremium";
import { post, getFile } from "../slice";
import {
  endpointResident,
  resident_statuses,
  request_premium_status,
  online_status,
  kyccolor,
  onboarding_status,
} from "../../settings";
import { getRequestPremium, approvedResident, disapprovedResident } from "../slices/requestpremium";

const columns = [
    {
      Header: "Resident Name", 
      accessor: "resident_name", 
      sorting: "resident_name"
    },
    {
      Header: "Unit Number", 
      accessor: "number", 
      sorting: "number"
    },
    // {
    //   Header: "Building", 
    //   accessor: "building", 
    //   sorting: "building"
    // },
    {
      Header: "ID Number", 
      accessor: "id_number", 
      sorting: "id_number"
    },
    {
      Header: "Phone", 
      accessor: "phone", 
      sorting: "phone"
    },
    {
      Header: "Status", 
      accessor: "status", 
      sorting: "status"
    },
    {
      Header: "Approved",
      accessor: (row) => (
        <Pill color={row.approved_status === "approved" ? "success" : "secondary"}>
          {toSentenceCase(row.approved_status) === "-" ? "Pending" : toSentenceCase(row.approved_status)}
        </Pill>
      ),
      sorting: "approved_status",
    },
    { 
      Header: "Approved By", 
      accessor: "staff_name", 
      sorting: "staff_name" 
    },
    { 
      Header: "Approved Date", 
      accessor: "approved_on", 
      sorting: "approved_on" 
    },
  ];

function Component({ view, canAdd }) {
  const { role, user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [res, setRes] = useState();

  const [status, setStatus] = useState("");
  const [approved_status, setApprovedStatus] = useState("");
  const [statusLabel, setStatusLabel] = useState("");
  const [KYCStatus, setKYCStatus] = useState("");
  const [KYCStatusLabel, setKYCStatusLabel] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("");
  const [onlineStatusLabel, setOnlineStatusLabel] = useState("");
  const [onboardingStatus, setOnboardingStatus] = useState("");
  const [onboardingStatusLabel, setOnboardingStatusLabel] = useState("");

  let fileInput = useRef();

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    // console.log(file);

    let form = new FormData();
    form.append("resident", file);

    setData(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  return (
    <>
      <TemplateRequestPremium
        view={view}
        columns={columns}
        slice={"requestpremium"}
        getAction={getRequestPremium}
        actions={
          view
            ? null
            : (role === "bm" ? !canAdd : false)
            ? null
            : []
        }
        approvedAction={view ? null : (role === "sa" || role === "bm") && approvedResident}
        disapprovedAction={view ? null : (role === "sa" || role === "bm") && disapprovedResident}
        filterVars={[approved_status]}
        filters={[
          {
            hidex: approved_status === "",
            label: <p>{approved_status ? "Approved Status: " + approved_status : "Approved Status: All"}</p>,
            delete: () => {
              setApprovedStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={request_premium_status}
                onClickAll={() => {
                  setApprovedStatus("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setApprovedStatus(el.value);
                  toggleModal(false);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}

export default Component;
