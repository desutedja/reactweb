import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pill from "../../components/Pill";
import Loading from "../../components/Loading";
import Filter from "../../components/Filter";

import Resident from "../../components/cells/Resident";

import { getResident, setSelected, deleteResident } from "../slices/resident";
import { toSentenceCase } from "../../utils";

import Template from "./components/Template";
import { post, getFile } from "../slice";
import {
  endpointResident,
  resident_statuses,
  resident_kyc_statuses,
  online_status,
  kyccolor,
  onboarding_status,
} from "../../settings";

const columns = [
  {
    Header: "Resident",
    accessor: (row) => <Resident id={row.id} data={row} />,
    sorting: "firstname",
  },
  {
    Header: "Status",
    accessor: (row) => (
      <Pill color={row.status === "active" ? "success" : "secondary"}>
        {toSentenceCase(row.status)}
      </Pill>
    ),
    sorting: "onboarding",
  },
  {
    Header: "Onboarded",
    accessor: (row) => (
      <Pill color={row.onboarding === "yes" ? "success" : "secondary"}>
        {toSentenceCase(row.onboarding)}
      </Pill>
    ),
    sorting: "onboarding",
  },
  {
    Header: "Online",
    accessor: (row) => (
      <Pill color={row.online === "yes" ? "success" : "secondary"}>
        {toSentenceCase(row.online)}
      </Pill>
    ),
    sorting: "online",
  },
  {
    Header: "Email",
    accessor: (row) => (
      <a target="_blank" rel="noopener noreferrer" href={"mailto:" + row.email}>
        {row.email}
      </a>
    ),
    sorting: "email",
  },
  { Header: "Phone", accessor: "phone", sorting: "phone" },
  {
    Header: "KYC Status",
    accessor: (row) =>
      row.status_kyc ? (
        <Pill color={kyccolor[row.status_kyc]}>
          {toSentenceCase(row.status_kyc)}
        </Pill>
      ) : (
        <Pill color="secondary">None</Pill>
      ),
    sorting: "status_kyc",
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
      <Modal
        isOpen={bulk}
        toggle={() => {
          setBulk(false);
          setRes();
        }}
        title="Upload Bulk File"
        okLabel={res ? "OK" : "Submit"}
        disablePrimary={loading}
        disableSecondary={loading}
        onClick={
          res
            ? () => {
                setBulk(false);
                setRes();
              }
            : () => {
                setLoading(true);
                dispatch(
                  post(
                    endpointResident + "/management/resident/register/bulk",
                    data,
                    (res) => {
                      setLoading(false);

                      setRes(res.data.data);
                    },
                    (err) => {
                      setLoading(false);
                    }
                  )
                );
              }
        }
      >
        {res ? (
          <div>
            <p
              style={{
                color: "seagreen",
              }}
            >
              {res.data ? res.data.length : 0} rows{" "}
              {res.error.length === 0
                ? "added succesfully."
                : "in correct format."}
            </p>
            <p
              style={{
                color: "crimson",
                marginBottom: 16,
              }}
            >
              {res.error ? res.error.length : 0} rows{" "}
              {res.error.length === 0 ? "failed to add." : "in wrong format."}
            </p>
            {res.error.map((el) => (
              <p
                style={{
                  color: "crimson",
                  marginBottom: 4,
                }}
              >
                {el}
              </p>
            ))}
          </div>
        ) : (
          <Loading loading={loading}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <input
                ref={fileInput}
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => {
                  setFile(fileInput.current.files[0]);
                }}
              />
              <button
                onClick={() => {
                  setLoading(true);
                  dispatch(
                    getFile(
                      user.resident_bulk_template,
                      "resident_template.xlsx",
                      (res) => {
                        setLoading(false);
                      }
                    )
                  );
                }}
                style={{
                  marginTop: 16,
                }}
              >
                Download Template
              </button>
            </div>
          </Loading>
        )}
      </Modal>
      <Template
        view={view}
        columns={columns}
        slice={"resident"}
        getAction={getResident}
        actions={
          view
            ? null
            : (role === "bm" ? !canAdd : false)
            ? null
            : [
                <Button
                  key="Add Resident"
                  label="Add Resident"
                  icon={<FiPlus />}
                  onClick={() => {
                    dispatch(setSelected({}));
                    history.push(url + "/add");
                  }}
                />,
                <Button
                  key="Add Resident Bulk"
                  label="Add Resident Bulk"
                  icon={<FiPlus />}
                  onClick={() => {
                    setBulk(true);
                  }}
                />,
              ]
        }
        deleteAction={view ? null : role === "sa" && deleteResident}
        filterVars={[status, KYCStatus, onlineStatus, onboardingStatus]}
        filters={[
          {
            hidex: status === "",
            label: <p>{status ? "Status: " + statusLabel : "Status: All"}</p>,
            delete: () => {
              setStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={resident_statuses}
                onClickAll={() => {
                  setStatus("");
                  setStatusLabel("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setStatus(el.value);
                  setStatusLabel(el.label);
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: KYCStatus === "",
            label: (
              <p>
                {KYCStatus
                  ? "KYC Status: " + KYCStatusLabel
                  : "KYC Status: All"}
              </p>
            ),
            delete: () => {
              setKYCStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={resident_kyc_statuses}
                onClickAll={() => {
                  setKYCStatus("");
                  setKYCStatusLabel("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setKYCStatus(el.value);
                  setKYCStatusLabel(el.label);
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: onlineStatus === "",
            label: (
              <p>
                {onlineStatus
                  ? "Online : " + onlineStatusLabel
                  : "Online : All"}
              </p>
            ),
            delete: () => {
              setOnlineStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={online_status}
                onClickAll={() => {
                  setOnlineStatus("");
                  setOnlineStatusLabel("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setOnlineStatus(el.value);
                  setOnlineStatusLabel(el.label);
                  toggleModal(false);
                }}
              />
            ),
          },
          {
            hidex: onboardingStatus === "",
            label: (
              <p>
                {onboardingStatus
                  ? "Onboarding : " + onboardingStatusLabel
                  : "Onboarding : All"}
              </p>
            ),
            delete: () => {
              setOnboardingStatus("");
            },
            component: (toggleModal) => (
              <Filter
                data={onboarding_status}
                onClickAll={() => {
                  setOnboardingStatus("");
                  setOnboardingStatusLabel("");
                  toggleModal(false);
                }}
                onClick={(el) => {
                  setOnboardingStatus(el.value);
                  setOnboardingStatusLabel(el.label);
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
