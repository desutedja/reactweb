import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiDownload, FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pill from "../../components/Pill";
import Loading from "../../components/Loading";
import Filter from "../../components/Filter";

import Resident from "../../components/cells/Resident";

import { getResident, setSelected, deleteResident } from "../slices/resident";
import { toSentenceCase } from "../../utils";

import TemplateLocalStorage from "./components/TemplateLocalStorage";
import { post, getFile, get } from "../slice";
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
  const [downloadResident, setDownloadResident] = useState(false);
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [res, setRes] = useState();

  const [status, setStatus] = useState(() => {
    const savedStatus = localStorage.getItem("filter_status");
    const initialStatus = savedStatus;
    return initialStatus || "";
  });
  const [statusLabel, setStatusLabel] = useState(() => {
    const savedLabelStatus = localStorage.getItem("label_status");
    const initialLabelStatus = savedLabelStatus;
    return initialLabelStatus || "";
  });
  const [KYCStatus, setKYCStatus] = useState(() => {
    const savedKYC = localStorage.getItem("filter_KYC");
    const initialKYC = savedKYC;
    return initialKYC || "";
  });
  const [KYCStatusLabel, setKYCStatusLabel] = useState(() => {
    const savedKYCLabel = localStorage.getItem("label_KYC");
    const initialKYCLabel = savedKYCLabel;
    return initialKYCLabel || "";
  });
  const [onlineStatus, setOnlineStatus] = useState(() => {
    const savedOnline = localStorage.getItem("filter_online");
    const initialOnline = savedOnline;
    return initialOnline || "";
  });
  const [onlineStatusLabel, setOnlineStatusLabel] = useState(() => {
    const savedOnlineLabel = localStorage.getItem("label_online");
    const initialOnlineLabel = savedOnlineLabel;
    return initialOnlineLabel || "";
  });
  const [onboardingStatus, setOnboardingStatus] = useState(() => {
    const savedOnboarding = localStorage.getItem("filter_onboarding");
    const initialOnboarding = savedOnboarding;
    return initialOnboarding || "";
  });
  const [onboardingStatusLabel, setOnboardingStatusLabel] = useState(() => {
    const savedOnboardingLabel = localStorage.getItem("label_onboarding");
    const initialOnboardingLabel = savedOnboardingLabel;
    return initialOnboardingLabel || "";
  });

  let fileInput = useRef();

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    // storing input status
    localStorage.setItem("filter_status", status);
    localStorage.setItem("label_status", statusLabel);
  }, [status, statusLabel]);

  useEffect(() => {
    // storing input status KYC
    localStorage.setItem("filter_KYC", KYCStatus);
    localStorage.setItem("label_KYC", KYCStatusLabel);
  }, [KYCStatus, KYCStatusLabel]);

  useEffect(() => {
    // storing input status KYC
    localStorage.setItem("filter_online", onlineStatus);
    localStorage.setItem("label_online", onlineStatusLabel);
  }, [onlineStatus, onlineStatusLabel]);

  useEffect(() => {
    // storing input status KYC
    localStorage.setItem("filter_onboarding", onboardingStatus);
    localStorage.setItem("label_onboarding", onboardingStatusLabel);
  }, [onboardingStatus, onboardingStatusLabel]);
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
              {res.error === null
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
              {res.error === null ? "failed to add." : "in wrong format."}
            </p>
            {res.error != null ? res.error.map((el) => (
              <p
                style={{
                  color: "crimson",
                  marginBottom: 4,
                }}
              >
                {el}
              </p>
            )) : 
              <p
                style={{
                  color: "seagreen",
                  marginBottom: 4,
                }}
              >
                {res.data.length} Resident(s) successfully added.
              </p>
              }
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
                      // user.resident_bulk_template,
                      "https://api.yipy.id/yipy-assets/asset-storage/document/ABB45E5DDEC4AF95D0960C2EB88CFC57.xlsx",
                      "resident_template.xlsx",
                      (res) => {
                        setLoading(false);
                      }
                    )
                  );
                }}
                style={{
                  marginTop: 16,
                  color: 'white'
                }}
              >
                Download Template
              </button>
            </div>
          </Loading>
        )}
      </Modal>
      <Modal
        isOpen={downloadResident}
        disableHeader={true}
        btnDanger
        onClick={() => {
        // dispatch(updateSetAsPaidSelectedDetail(multiActionRows));
          setDownloadResident(false);
        }}
        toggle={() => {
          setDownloadResident(false);
        }}
        okLabel={"Yes"}
        cancelLabel={"Cancel"}
      >
        This Feature is under development. Stay Tuned..
      </Modal>      
      <TemplateLocalStorage
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
        actionDownloads={
          view 
            ? null
            : [
              <Button
                color="Download"
                key="Download Data Resident"
                label="Download Resident.csv"
                icon={<FiDownload />}
                onClick={() => {
                  setLoading(true);
                  dispatch(getFile(endpointResident + "/management/resident/download?onboarding=" +
                  onboardingStatus,
                  "Data_Resident_Onboarding="+(onboardingStatus ? toSentenceCase(onboardingStatus) : "All")+".csv",
                  (res) => {
                    setLoading(false);
                  },
                  (err) => {
                    setLoading(false);
                  }
                  ))}
                }
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
