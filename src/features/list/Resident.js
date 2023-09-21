import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCheckCircle,
  FiCircle,
  FiDisc,
  FiDownload,
  FiHelpCircle,
  FiPlus,
  FiSearch,
} from "react-icons/fi";

import Button from "../../components/Button";
import ButtonWizard from "../../components/ButtonWizard";
import Modal from "../../components/Modal";
import ModalWizard from "../../components/ModalWizard";
import Pill from "../../components/Pill";
import Loading from "../../components/Loading";
import Filter from "../../components/Filter";
import Input from "../../components/Input";

import Resident from "../../components/cells/Resident";

import { getResident, setSelected, deleteResident, residentReturnToBasic } from "../slices/resident";
import { toSentenceCase } from "../../utils";

import TemplateLocalStorage from "./components/TemplateLocalStorage";
import { post, getFile,getFileS3, get } from "../slice";
import {
  endpointResident,
  resident_statuses,
  resident_kyc_statuses,
  online_status,
  kyccolor,
  onboarding_status,
  endpointAdmin,
} from "../../settings";

const columns = [
  {
    Header: "Resident",
    accessor: (row) => <Resident id={row.id} data={row} />,
    sorting: "firstname",
  },
  {
    Header: "Building",
    accessor: (row) => row.building_name,
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
  { Header: "Resident Type", accessor: (row) => (row.resident_type == "" ? "basic" : row.resident_type), sorting: "resident_type" },
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
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

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
  const [building, setBuilding] = useState("");
  const [buildingLabel, setBuildingLabel] = useState("");
  const [buildingList, setBuildingList] = useState("");

  const residentTypes = [
    { label: "Basic", value: "basic" },
    { label: "Premium", value: "premium" },
  ];

  const [residentType, setResidentType] = useState("");
  const [residentTypeLabel, setResidentTypeLabel] = useState("");

  const [openWizard, setOpenWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const wizardBackFunction = useCallback(
    () => setWizardStep(wizardStep != 1 ? wizardStep - 1 : wizardStep),
    [wizardStep]
  );

  let fileInput = useRef();

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

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
      {/* Start of Web Wizard */}
      <ModalWizard
        width="1080px"
        padding="0px"
        margin="90px"
        className="special_modal"
        isOpen={openWizard}
        disableFooter
        disableHeader
        toggle={() => setOpenWizard(false)}
      >
        {wizardStep === 1 && (
          <>
            <div className="row">
              <div className="col-4">
                <img
                  src={require("../../assets/quick_start.jpg")}
                  width="280px"
                  height="480px"
                  style={{
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  }}
                />
              </div>
              <div className="col-8">
                <div className="wizard-title">
                  Apa yang ingin kamu pelajari?
                </div>
                <div className="wizard-body">
                  Kamu dapat mempelajari berbagai fitur yang ada di menu ini.
                </div>
                <div className="wizard-body">
                  Silahkan pilih salah satu untuk melanjutkan.
                </div>
                {/* <div className="Container-wizard border-wizard">Resident</div> */}
                <div className="col">
                  <div
                    className="Container-wizard border-wizard d-flex flex-column"
                    onClick={() => {
                      setWizardStep(2);
                    }}
                  >
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            src={require("../../assets/Resident_Wizard.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-4 wizard-title-container">
                          Add Resident
                        </div>
                        <div className="text-nowrap ml-4 wizard-body-container">
                          Tambah resident dengan input data satu per satu.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div
                    className="Container-wizard border-wizard d-flex flex-column"
                    onClick={() => {
                      setWizardStep(8);
                    }}
                  >
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <div className="w-auto">
                          <img
                            src={require("../../assets/Resident_Wizard_Group.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-nowrap ml-4 wizard-title-container">
                          Add Resident Bulk
                        </div>
                        <div className="text-nowrap ml-4 wizard-body-container">
                          Tambah resident dengan input data dalam jumlah banyak.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* Start of Wizard Add Resident */}
        {wizardStep === 2 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Klik tombol “<b>+ Add Resident</b>”. Lalu kamu dapat memasukkan
                email atau no. HP saja atau memasukkan keduanya.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(3);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 3 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Masukkan nama depan dan nama belakang pada form yang tersedia.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(4);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(2);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 4 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Isi data kewarganegaraan, tempat dan tanggal lahir, jenis
                kelamin, status pernikahan dan pekerjaan.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/step_3.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(5);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(3);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 5 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Masukkan alamat rumah dengan lengkap.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/step_4.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(6);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(4);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 6 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Masukkan nama bank, nomor rekening, dan nama pemilik rekening.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/step_5.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(7);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(5);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 7 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Check Email/No. HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Full Name
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Address
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Bank Account
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                <b>Apa yang dapat dilakukan selanjutnya?</b>{" "}
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body mt-4">
                <ul>
                  <li>
                    Setelah berhasil melakukan Add Resident, kamu dapat melihat
                    detail informasi resident tersebut di Menu Resident.
                  </li>
                  <li>Kamu dapat menambahkan unit pada resident tersebut.</li>
                  <li>
                    Kamu dapat mengedit detail informasi resident tersebut jika
                    ada kesalahan saat input data.
                  </li>
                  <li>
                    Kamu dapat menghapus resident jika resident tersebut sudah
                    tidak berada di building kamu.
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Done"
                  onClick={() => {
                    setWizardStep(1);
                    setOpenWizard(false);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(6);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Add Resident */}
        {/* Start of Wizard Add Resident Bulk */}
        {wizardStep === 8 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident Bulk
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Download Template
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Isi Form Data Resident
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Upload Bulk File
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Klik tombol “<b>+ Add Resident</b>”. Lalu klik tombol “Download
                Template”.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/uploadBulkRes/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(9);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 9 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident Bulk
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Download Template
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Resident
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Upload Bulk File
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Buka file resident template yang sudah kamu download tadi. Lalu
                isi data resident sesuai dengan tabel yang sudah disediakan.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/uploadBulkRes/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(10);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(8);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 10 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident Bulk
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Download Template
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Resident
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Upload Bulk File
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Setelah mengisi data resident di template tadi, upload kembali
                file tersebut lalu submit.{" "}
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/uploadBulkRes/step_3.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(11);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(9);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 11 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Add Resident Bulk
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Download Template
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Resident
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Upload Bulk File
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Information
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                <b>Apa yang dapat dilakukan selanjutnya?</b>{" "}
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body mt-4">
                <ul>
                  <li>
                    Setelah berhasil melakukan Add Resident Bulk, kamu dapat
                    melihat detail informasi resident tersebut di Menu Resident.
                  </li>
                  <li>
                    Kamu dapat menambahkan unit tambahan jika diperlukan pada
                    resident tersebut.
                  </li>
                  <li>
                    Kamu dapat mengedit detail informasi resident tersebut jika
                    ada kesalahan saat input data.
                  </li>
                  <li>
                    Kamu dapat menghapus resident jika resident tersebut sudah
                    tidak berada di building kamu.
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div
                className="col text-right"
                style={{ marginBottom: "10px", marginRight: "5px" }}
              >
                <Button
                  className="float-right"
                  key="?"
                  label="Done"
                  onClick={() => {
                    setWizardStep(1);
                    setOpenWizard(false);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(10);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Add Resident Bulk */}
      </ModalWizard>
      {/* End of Web Wizard */}
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
              {res.error === null ? "added succesfully." : "in correct format."}
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
            {res.error != null ? (
              res.error.map((el) => (
                <p
                  style={{
                    color: "crimson",
                    marginBottom: 4,
                  }}
                >
                  {el}
                </p>
              ))
            ) : (
              <p
                style={{
                  color: "seagreen",
                  marginBottom: 4,
                }}
              >
                {res.data.length} Resident(s) successfully added.
              </p>
            )}
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
                  dispatch(getFileS3("https://yipy-assets.s3.ap-southeast-1.amazonaws.com/template/template_upload_resident_bulk.xlsx", "template_upload_resident_bulk.xlsx", res => {
                      setLoading(false);
                  }))
                }}
                style={{
                  marginTop: 16,
                  color: "white",
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
        pagetitle="Resident List"
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
                <ButtonWizard
                  color="Download"
                  icon={<FiHelpCircle style={{ fontSize: "16px" }} />}
                  onClick={() => {
                    setOpenWizard(true);
                  }}
                />,
                <Button
                  fontWeight={500}
                  color="Download"
                  key="Download Data Resident"
                  label="Download Resident.csv"
                  icon={<FiDownload />}
                  onClick={() => {
                    setLoading(true);
                    dispatch(
                      getFile(
                        endpointResident +
                          "/management/resident/read/v2?export=true"+
                          "&onboarding=" +
                          onboardingStatus+
                          "&building_id="+
                          building+
                          "&resident_type="+
                          residentType+
                          "&page="+
                          1+
                          "&limit="+
                          10000000,
                        "Data_Resident_Onboarding=" +
                          (onboardingStatus
                            ? toSentenceCase(onboardingStatus)
                            : "All") +
                          ".csv",
                        (res) => {
                          setLoading(false);
                        },
                        (err) => {
                          setLoading(false);
                        }
                      )
                    );
                  }}
                />,
              ]
        }
        deleteAction={deleteResident}
        returnBasicAction={view ? null : role === "sa" && residentReturnToBasic}
        filterVars={[
          status,
          KYCStatus,
          onlineStatus,
          onboardingStatus,
          building,
          residentType,
        ]}
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
          {
            label: "Building: ",
            value: building ? buildingLabel : "All",
            hidex: building === "",
            delete: () => setBuilding(""),
            component: (toggleModal) => (
              <>
                <Input
                  label="Search Building"
                  compact
                  icon={<FiSearch />}
                  inputValue={search}
                  setInputValue={setSearch}
                />
                <Filter
                  data={buildingList}
                  onClick={(el) => {
                    if (!el.value) {
                      setLimit(limit + el.restTotal);
                      return;
                    }
                    setBuilding(el.value);
                    setBuildingLabel(el.label);
                    setLimit(5);
                    toggleModal(false);
                  }}
                  onClickAll={() => {
                    setBuilding("");
                    setBuildingLabel("");
                    setLimit(5);
                    toggleModal(false);
                  }}
                />
              </>
            ),
          },
          {
            hidex: residentType === "",
            label: (
              <p>
                {residentTypeLabel ? "Resident Type: " + residentTypeLabel : "Resident Type: All"}
              </p>
            ),
            delete: () => {
              setResidentType("");
              setResidentTypeLabel("");
            },
            component: (toggleModal) => (
              <Filter
                data={residentTypes}
                onClick={(el) => {
                  setResidentType(el.value);
                  setResidentTypeLabel(el.label);
                  toggleModal(false);
                }}
                onClickAll={() => {
                  setResidentType("");
                  setResidentTypeLabel("");
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
