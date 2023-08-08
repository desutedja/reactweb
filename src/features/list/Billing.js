import React, { useState, useEffect, useRef } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiDownload,
  FiUpload,
  FiCheck,
  FiHelpCircle,
  FiCheckCircle,
  FiDisc,
  FiCircle,
} from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import CustomAlert from "../../components/CustomAlert";
import PillBilling from "../../components/PillBilling";
import { closeAlert } from "../slice";
import "react-confirm-alert/src/react-confirm-alert.css";

import Modal from "../../components/Modal";
import ModalWizard from "../../components/ModalWizard";

import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import ButtonWizard from "../../components/ButtonWizard";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
  getBillingUnit,
  downloadBillingUnit,
  downloadSetAsPaidBulk,
  setSelectedItem,
  setSelected,
  updateBillingPublish,
  updateSetAsPaidSelected,
  refresh,
  startAsync,
  stopAsync,
} from "../slices/billing";
import { endpointAdmin, endpointBilling, online_status } from "../../settings";
import {
  toSentenceCase,
  toMoney,
  inputDateTimeFormatter,
  inputDateTimeFormatter24,
  dateTimeFormatterScheduler,
} from "../../utils";
import { get, post, setInfo } from "../slice";

import TemplateWithSelectionAndDate from "./components/TemplateWithSelectionAndDate";
import UploadModal from "../../components/UploadModal";
import UploadModalV2 from "../../components/UploadModalV2";

function Component({ view }) {
  const [search, setSearch] = useState("");

  const { role, user } = useSelector((state) => state.auth);

  const [modalPublish, toggleModalPublish] = useState(false);
  const [openReleaseWithSchedule, setOpenReleaseWithSchedule] = useState(false);
  const [type, setType] = useState("now");
  const [selectWithImage, setSelectWithImage] = useState("n");
  const [schedule, setSchedule] = useState("");
  const handleShow = () => toggleModalPublish(true);
  const [buildingRelease, setBuildingRelease] = useState("");

  const [building, setBuilding] = useState(() => {
    const savedBuilding = localStorage.getItem("filter_building");
    const initialBuilding = savedBuilding;
    return initialBuilding || "";
  });
  const [buildingName, setBuildingName] = useState(() => {
    const savedBuildingLabel = localStorage.getItem("label_building");
    const initialBuildingLabel = savedBuildingLabel;
    return initialBuildingLabel || "";
  });

  const [buildings, setBuildings] = useState("");
  const [buildingList, setBuildingList] = useState("");
  const [released, setReleased] = useState(() => {
    const savedReleased = localStorage.getItem("filter_released");
    const initialReleased = savedReleased;
    return initialReleased || "";
  });
  const [multiActionRows, setMultiActionRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [alert, setAlert] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const fileInput = useRef();

  const [limit, setLimit] = useState(5);
  const [upload, setUpload] = useState(false);
  const [uploadSetAsPaid, setUploadSetAsPaid] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const yearnow = new Date().getFullYear();
  const years = [];

  for (let i = yearnow - 1; i <= yearnow + 1; i++) {
    years.push({ value: i, label: i });
  }

  const [year, setYear] = useState(yearnow);

  const monthnow = new Date().getMonth();
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yesno = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  const [withImage, setWithImage] = useState("");

  const [month, setMonth] = useState(monthnow + 1);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  let buildingBM = Object.keys(buildings).map((keys)=> {return buildings[keys].value});


  useEffect(() => {
    // storing input status
    localStorage.setItem("filter_building", building);
    localStorage.setItem("label_building", buildingName);
  }, [building, buildingName]);

  useEffect(() => {
    // storing input status
    localStorage.setItem("filter_released", released);
  }, [released]);

  useEffect(() => {
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

          let formatted = data.map((el) => ({ label: el.name, value: el.id }));

          if (data.length < totalItems && search.length === 0) {
            formatted.push({
              label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
              restTotal: restTotal > 5 ? 5 : restTotal,
              className: "load-more",
            });
          }

          setBuildings(formatted);
        }
      )
    );
  }, [dispatch, search, limit]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.building_name,
            value: el.building_id,
          }));

          setBuildingList(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (role) {
      setColumns([
        // { Header: 'ID', accessor: 'code' },
        { Header: "ID", accessor: "id" },
        {
          Header: "Unit",
          accessor: (row) => (
            <span
              className="Link"
              onClick={() => {
                history.push("/" + role + "/billing/unit/" + row.id);
              }}
            >
              <b>
                {toSentenceCase(row.section_type) +
                  " " +
                  row.section_name +
                  " " +
                  row.number}
              </b>
              <br />
              <span>{row.building_name}</span>
            </span>
          ),
        },
        {
          Header: "Resident",
          accessor: (row) => (row.resident_name ? row.resident_name : "-"),
        },
        { Header: "Year", accessor: (row) => row.year },
        { Header: "Month", accessor: (row) => row.month },
        {
          Header: "Status",
          accessor: (row) => (
            <PillBilling
              minWidth="80px"
              paddingTop="6px"
              paddingBottom="6px"
              color={
                row.status === "paid"
                  ? "success"
                  : row.status == "some paid"
                  ? "warning text-white"
                  : row.status == "unpaid"
                  ? "danger"
                  : ""
              }
            >
              {toSentenceCase(row.status)}
            </PillBilling>
          ),
        },
        {
          Header: "Total",
          accessor: (row) => <b>{toMoney(row.total)}</b>,
        },
        { Header: "Released", accessor: (row) => row.released },
        //{ Header: "With Image", accessor: (row) => row.with_image },
        {
          Header: "Release Schedule",
          accessor: (row) =>
            row.schedule_date
              ? dateTimeFormatterScheduler(row.schedule_date)
              : "-",
        },
      ]);
    }
  }, [role]);

  useEffect(() => {
    if (search.length === 0) setLimit(5);
  }, [search]);

  function uploadResult(result) {
    return (
      <>
        <div>
          <h5>Total of {result.main_billings_total} billings was read</h5>
        </div>
        <hr />
        <ListGroup style={{ marginBottom: "20px" }}>
          <ListGroupItem color="success">
            {result.main_billings_success} billings successfully created.
          </ListGroupItem>
          <ListGroupItem color="danger">
            {result.main_billings_failed} billings failed to create.
          </ListGroupItem>
        </ListGroup>
        <ListGroup>
          <p>Showing up to 100 result: </p>
          {result.main_billings?.map((el, index) => {
            /* only show up to 10 rows */
            return (
              <>
                {index < 100 && (
                  <ListGroupItem
                    color={
                      !el.row_error && !el.column_error ? "success" : "danger"
                    }
                  >
                    {!el.row_error && !el.column_error ? (
                      <>
                        Row {el.row_number}: <b>{el.data?.name}</b> for unit ID{" "}
                        <b>{el.data?.resident_unit}</b> was created{" "}
                        <b>(ID: {el.data?.id})</b>.
                      </>
                    ) : (
                      <>
                        Row {el.row_number}:{" "}
                        {el.row_error && <>{el.row_error},</>}{" "}
                        {el.column_error &&
                          el.column_error.map(
                            (k) => k.column_name + " " + k.error_message
                          )}
                      </>
                    )}
                  </ListGroupItem>
                )}
              </>
            );
          })}
        </ListGroup>
        <div style={{ marginTop: "20px" }}>
          <h5>
            Total of {result.additional_charges_total} additional charges was
            read
          </h5>
        </div>
        <hr />
        <ListGroup style={{ marginBottom: "20px" }}>
          <ListGroupItem color="success">
            {result.additional_charges_success} additional charges successfully
            created.
          </ListGroupItem>
          <ListGroupItem color="danger">
            {result.additional_charges_failed} additional charges failed to
            create.
          </ListGroupItem>
        </ListGroup>
        <p>Showing up to 100 result: </p>
        {result.additional_charges?.map((el, index) => {
          /* only show up to 10 rows */
          return (
            <>
              {index < 100 && (
                <ListGroupItem
                  color={
                    !el.row_error && !el.column_error ? "success" : "danger"
                  }
                >
                  {!el.row_error && !el.column_error ? (
                    <>
                      Row {el.row_number}: <b>{el.data?.charge_name}</b> for
                      billing ID <b>{el.data?.billing_id}</b> was created.
                    </>
                  ) : (
                    <>
                      Row {el.row_number}:{" "}
                      {el.row_error && <>{el.row_error},</>}{" "}
                      {el.column_error &&
                        el.column_error.map(
                          (k) => k.column_name + " " + k.error_message
                        )}
                    </>
                  )}
                </ListGroupItem>
              )}
            </>
          );
        })}
      </>
    );
  }

  function uploadResultSetAsPaid(result) {
    return (
      <>
        {result.status == "Success" ? (
          <>
            <div>
              <h5>{result.message}</h5>
            </div>
          </>
        ) : (
          <>
            <div>
              <h5 class="red">{result.message}</h5>
            </div>
          </>
        )}
      </>
    );
  }

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
        bodyheight={wizardStep === [2, 3, 4, 5] ? "480px" : ""}
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
                <div className="col">
                  <div className="wizard-title">
                    Apa yang ingin kamu pelajari?
                  </div>
                  <div className="wizard-body">
                    Kamu dapat mempelajari berbagai fitur yang ada di menu ini.
                  </div>
                  <div className="wizard-body">
                    Silahkan pilih salah satu untuk melanjutkan.
                  </div>
                </div>
                <div className="row" style={{ marginRight: "20px" }}>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(2);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Upload Bulk Billing
                          </div>
                          <div className="wizard-body-container-bil">
                            Upload billing resident <br /> secara massal.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(6);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Upload Bulk Set As Paid
                          </div>
                          <div className="wizard-body-container-bil">
                            Atur status billing menjadi <br /> Paid secara
                            massal.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(10);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Release All
                          </div>
                          <div className="wizard-body-container-bil">
                            Release semua billing kepada <br /> resident.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(14);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Release Selected
                          </div>
                          <div className="wizard-body-container-bil">
                            Release beberapa billing yang <br /> sudah dipilih
                            kepada resident.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(17);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Set As Paid Selected
                          </div>
                          <div className="wizard-body-container-bil">
                            Atur status beberapa billing yang <br /> sudah
                            dipilih menjadi Paid.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(20);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Download Billing Unit
                          </div>
                          <div className="wizard-body-container-bil">
                            Unduh semua data billing unit <br /> dalam file csv.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Start of Wizard Upload Bulk Billing */}
        {wizardStep === 2 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Upload Bulk Billing
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Isi Form Data Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Klik tombol “<b>+ Upload Bulk</b>”. Lalu klik tombol “
                <b>Download Template</b>”.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              ></div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "330px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
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
                Upload Bulk Billing
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Buka file <b>Template Upload Bulk Billing</b> yang sudah kamu
                download tadi. Lalu isi data billing sesuai dengan tabel yang
                sudah disediakan.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              ></div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "330px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
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
                Upload Bulk Billing
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Setelah mengisi data billing di template tadi, upload kembali
                file tersebut lalu submit.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              ></div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "330px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
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
                Upload Bulk Billing
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Data Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
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
                    Setelah berhasil melakukan Upload Bulk Billing, kamu dapat
                    melihat detail billing tersebut di Menu Billing &gt; Unit.
                  </li>
                  <li>
                    Kamu dapat menambahkan billing tambahan di detail billing
                    jika diperlukan.
                  </li>
                  <li>
                    Kamu dapat merelease billing tersebut kepada resident yang
                    bersangkutan.
                  </li>
                  <li>
                    Kamu dapat melakukan set as paid jika ada tagihan yang belum
                    ter-paid oleh sistem.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "215px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(4);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Upload Bulk Billing */}

        {/* Start of Wizard Upload Bulk Set As paid */}
        {wizardStep === 6 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Upload Bulk Set As Paid
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Isi Form Template Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Klik tombol “<b>+ Upload Bulk Set As Paid</b>”. Lalu klik tombol
                “<b>Download Template</b>”.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/bulk_set_as_paid/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(1);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
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
                Upload Bulk Set As Paid
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Template Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Buka file <b>Template Set As Paid</b> yang sudah kamu download
                tadi. Lalu isi data sesuai dengan tabel yang sudah disediakan.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/bulk_set_as_paid/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(8);
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 8 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Upload Bulk Set As Paid
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Template Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Setelah mengisi data billing yang akan di set as paid pada
                template tadi, upload kembali file tersebut lalu submit.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/bulk_set_as_paid/step_3.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(7);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
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
                Upload Bulk Set As Paid
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Isi Form Template Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
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
                  <div className="row no-gutters">
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
                    Setelah berhasil melakukan Upload Bulk Set As Paid, kamu
                    akan mendapatkan notifikasi sukses upload.
                  </li>
                  <li>
                    Kamu dapat melihat status data yang kamu upload tadi pada
                    file <b>data.csv</b> yang otomatis terdownload setelah kamu
                    melakukan <br />
                    upload bulk set as paid.
                  </li>
                  <li>
                    Dalam data.csv tersebut ada kolom keterangan <b>status</b>{" "}
                    yang menunjukkan data yang kamu upload apakah berhasil atau
                    tidak.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "215px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(8);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Upload Bulk Set As paid */}

        {/* Start of Wizard Release All */}
        {wizardStep === 10 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release All
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Klik Release All
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Pilih Bulan dan Tahun
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Klik tombol “<b>Release All</b>”. Lalu akan muncul popup untuk
                mengatur data billing yang akan kamu release.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/release_all/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(1);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
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
                Release All
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Klik Release All
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Bulan dan Tahun
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Pilih bulan dan tahun untuk merelease billing yang ada di
                periode tersebut.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/release_all/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(12);
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 12 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release All
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Klik Release All
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Bulan dan Tahun
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Pilih <b>Now</b> untuk langsung release, atau <b>Other</b> untuk
                mengatur jadwal release billing. Lalu pilih release dengan foto
                catat meter atau tidak.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/release_all/step_3.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(13);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(11);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 13 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release All
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Klik Release All
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Bulan dan Tahun
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                <b>Apa yang dapat dilakukan selanjutnya?</b>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body mt-4">
                <ul>
                  <li>
                    Setelah berhasil melakukan Release All, kamu akan
                    mendapatkan pemberitahuan jumlah billing yang sukses
                    direlease.
                  </li>
                  <li>
                    Resident akan mendapatkan push notifikasi mengenai tagihan
                    billing pada akun Yipy mereka.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "215px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(12);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Release All */}

        {/* Start of Wizard Release Selected */}
        {wizardStep === 14 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Pilih bulan dan tahun untuk merelease billing yang ada di
                periode tersebut.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/release_selected/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(15);
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 15 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Pilih <b>Now</b> untuk langsung release, atau <b>Other</b> untuk
                mengatur jadwal release billing. Lalu pilih release dengan foto
                catat meter atau tidak.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/release_selected/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(16);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(14);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 16 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Release Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Atur Waktu Release
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                <b>Apa yang dapat dilakukan selanjutnya?</b>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body mt-4">
                <ul>
                  <li>
                    Setelah berhasil melakukan Release All, kamu akan
                    mendapatkan pemberitahuan jumlah billing yang sukses
                    direlease.
                  </li>
                  <li>
                    Resident akan mendapatkan push notifikasi mengenai tagihan
                    billing pada akun Yipy mereka.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "215px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(15);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Release Selected */}

        {/* Start of Wizard Set As Paid Selected */}
        {wizardStep === 17 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Set As Paid Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body-inactive">
                        Konfirmasi Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Pilih billing, lalu klik tombol <b>Set As Paid Selected</b>.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/set_as_paid_selection/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(18);
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
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 18 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Set As Paid Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Konfirmasi Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard-inactive d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon-inactive">
                        <FiCircle />
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
                Setelah itu akan muncul popup konfirmasi. Klik <b>Yes</b> jika
                kamu yakin untuk melakukan set as paid atau <b>No</b> untuk
                membatalkan.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/set_as_paid_selection/step_2.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
                <Button
                  className="float-right"
                  key="?"
                  label="Next"
                  onClick={() => {
                    setWizardStep(19);
                  }}
                />
                <Button
                  className="float-right"
                  color="Secondary"
                  key="?"
                  label="Previous"
                  onClick={() => {
                    setWizardStep(17);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {wizardStep === 19 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Set As Paid Selected
              </div>
            </div>
            <div className="row">
              <div className="col ml-4">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Pilih Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="Container-step-wizard border-step-wizard-done d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiCheckCircle />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Konfirmasi Set As Paid
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
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
                <b>Apa yang dapat dilakukan selanjutnya?</b>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body mt-4">
                <ul>
                  <li>
                    Akan ada pemberitahuan di halaman tersebut apakah set as
                    paid berhasil atau gagal.
                  </li>
                  <li>
                    Status billing tersebut akan berubah dari Unpaid menjadi
                    Paid.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: "215px",
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(18);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Set As Paid Selected */}

        {/* Start of Wizard Download Billing Unit */}
        {wizardStep === 20 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Download Billing Unit
              </div>
            </div>
            <div className="row">
              <div className="col ml-4 mr-4">
                <div className="Container-step-wizard border-step-wizard d-flex flex-column">
                  <div className="row no-gutters">
                    <div className="col-auto">
                      <div className="w-auto wizard-step-body-icon">
                        <FiDisc />
                      </div>
                    </div>
                    <div className="col">
                      <div className="text-nowrap ml-1 wizard-step-body">
                        Download Billing Unit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Klik tombol <b>Download Billing Unit.csv</b>. Kamu dapat melihat
                semua informasi billing lengkap dengan informasi resident
                tersebut.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/download_billing_unit/step_1.gif")}
                  width="100%"
                />
              </div>
            </div>
            <div
              className="row"
              style={{
                marginBottom: "10px",
                marginRight: "5px",
                marginLeft: "5px",
              }}
            >
              <div className="col text-right">
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
                    setWizardStep(1);
                  }}
                />
                <Button
                  color="Secondary"
                  className="float-left"
                  key="?"
                  label="Cancel"
                  onClick={() => {
                    setWizardStep(1);
                  }}
                />
              </div>
            </div>
          </>
        )}
        {/* End of Wizard Download Billing Unit */}
      </ModalWizard>
      {/* End of Web Wizard */}
      <Modal
        isOpen={modalPublish}
        toggle={() => {
          toggleModalPublish(false);
        }}
        title="Publish All"
        okLabel={"Submit"}
        onClick={() => {
          dispatch(
            post(
              endpointBilling + "/management/billing/publish-billing-building",
              {
                building_id: buildingRelease,
                year: "" + year,
                month: "" + month,
                with_image: selectWithImage,
                published_date: inputDateTimeFormatter24(schedule),
              },
              (res) => {
                dispatch(
                  setInfo({
                    color: "success",
                    message: `${res.data.data} billing has been set to released.`,
                  })
                );
                // resultComponent ? setOpenRes(true) : toggle();
              },
              (err) => {
                dispatch(
                  setInfo({
                    color: "error",
                    message: `Error to released.`,
                  })
                );
                console.log("error");
              }
            )
          );

          dispatch(refresh());
          dispatch(stopAsync());
          toggleModalPublish(false);
        }}
      >
        <Input
          label="Building"
          inputValue={buildingRelease}
          type="select"
          options={buildingList}
          setInputValue={setBuildingRelease}
          title="Building List"
          hidden={role !== "sa"}
        />

        <Input
          label="Month"
          inputValue={month}
          type="select"
          options={months}
          setInputValue={setMonth}
          title="Month List"
        />

        <Input
          label="Year"
          inputValue={year}
          type="select"
          options={years}
          setInputValue={setYear}
          title="Year List"
        />

        <Input
          label="Choose Release Schedule"
          type="radio"
          name="release_type"
          options={[
            { value: "now", label: "Now" },
            { value: "other", label: "Other" },
          ]}
          inputValue={type}
          setInputValue={setType}
        />

        {type === "now" ? null : (
          <Input
            type="datetime-local"
            label="Schedule"
            name="published_date"
            inputValue={schedule}
            setInputValue={setSchedule}
          />
        )}

        <Input
          label="Release with image from catat meter?"
          type="radio"
          name="with_image"
          options={[
            { value: "y", label: "Yes" },
            { value: "n", label: "No" },
          ]}
          inputValue={selectWithImage}
          setInputValue={setSelectWithImage}
        />
      </Modal>

      <Modal
        isOpen={openReleaseWithSchedule}
        toggle={() => {
          setOpenReleaseWithSchedule(false);
        }}
        title="Release Billing"
        okLabel={"Yes, Submit"}
        onClick={() => {
          dispatch(startAsync());
          type !== "now"
            ? dispatch(
                post(
                  endpointBilling + "/management/billing/publish-billing",
                  {
                    data: multiActionRows,
                    with_image: selectWithImage,
                    published_date: inputDateTimeFormatter24(schedule),
                  },
                  (res) => {
                    dispatch(
                      setInfo({
                        color: "success",
                        message: `${res.data.data} billing has been set to released.`,
                      })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                    dispatch(refresh());
                    dispatch(stopAsync());
                  },
                  (err) => {
                    dispatch(
                      setInfo({
                        color: "error",
                        message: `Error to released.`,
                      })
                    );
                    console.log("error");
                  }
                )
              )
            : dispatch(
                post(
                  endpointBilling + "/management/billing/publish-billing",
                  {
                    data: multiActionRows,
                    with_image: selectWithImage,
                  },
                  (res) => {
                    dispatch(
                      setInfo({
                        color: "success",
                        message: `${res.data.data} billing has been set to released.`,
                      })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                    dispatch(refresh());
                    dispatch(stopAsync());
                  },
                  (err) => {
                    dispatch(
                      setInfo({
                        color: "error",
                        message: `Error to released.`,
                      })
                    );
                    console.log("error");
                  }
                )
              );

          setOpenReleaseWithSchedule(false);
        }}
      >
        <Input
          label="Choose Release Schedule"
          type="radio"
          name="release_type"
          options={[
            { value: "now", label: "Now" },
            { value: "other", label: "Other" },
          ]}
          inputValue={type}
          setInputValue={setType}
        />

        {type === "now" ? null : (
          <Input
            type="datetime-local"
            label="Schedule"
            name="published_date"
            inputValue={schedule}
            setInputValue={setSchedule}
          />
        )}

        <Input
          label="Release with image from catat meter?"
          type="radio"
          name="with_image"
          options={[
            { value: "y", label: "Yes" },
            { value: "n", label: "No" },
          ]}
          inputValue={selectWithImage}
          setInputValue={setSelectWithImage}
        />
      </Modal>

      <UploadModal
        open={upload}
        toggle={() => setUpload(false)}
        // templateLink={user.billing_bulk_template}
        templateLink={
          "https://yipy-assets.s3.ap-southeast-1.amazonaws.com/template/template_bulk_upload_billing.xlsx"
        }
        filename="billing_unit_template.xlsx"
        uploadLink={endpointBilling + "/management/billing/upload"}
        uploadDataName="file_upload"
        resultComponent={uploadResult}
      />

      <UploadModalV2
        open={uploadSetAsPaid}
        toggle={() => setUploadSetAsPaid(false)}
        templateLink={
          "https://yipy-assets.s3.ap-southeast-1.amazonaws.com/template/template_upload_setaspaid_bulk.xlsx"
        }
        filename="set_as_paid_template.xlsx"
        uploadLink={
          role != "sa" ? 
          endpointBilling + "/management/billing/setaspaidbulk/v2?building_id=" + buildingBM : endpointBilling + "/management/billing/setaspaidbulk/v2?building_id=" + building
        }
        uploadDataName="file_upload"
        resultComponent={uploadResultSetAsPaid}
      />

      <CustomAlert
        isOpen={alert}
        toggle={() => setAlert(false)}
        title={"Error"}
        subtitle={"Please Choose Building"}
        content={"You need to choose Building first"}
      />

      <TemplateWithSelectionAndDate
        view={view}
        title="Unit"
        pagetitle="Billing List Unit"
        columns={columns}
        slice="billing"
        getAction={getBillingUnit}
        selectAction={(selectedRows) => {
          const selectedRowIds = [];
          selectedRows.map((row) => {
            if (row !== undefined) {
              selectedRowIds.push({
                unit_id: row.id,
                month: row.month,
                year: row.year,
              });
            }
          });
          setMultiActionRows([...selectedRowIds]);
        }}
        filterVars={[building, released]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: (
                    <p>
                      Building: {building ? <b>{buildingName}</b> : <b>All</b>}
                    </p>
                  ),
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
                        data={buildings}
                        onClick={(el) => {
                          if (!el.value) {
                            setLimit(limit + el.restTotal);
                            return;
                          }
                          setBuilding(el.value);
                          setBuildingName(el.label);
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                        onClickAll={() => {
                          setBuilding("");
                          setBuildingName("");
                          toggleModal(false);
                          setSearch("");
                          setLimit(5);
                        }}
                      />
                    </>
                  ),
                },
                {
                  hidex: released === "",
                  label: (
                    <p>
                      Released:
                      {released ? (
                        <b> {toSentenceCase(released)}</b>
                      ) : (
                        <b> All</b>
                      )}
                    </p>
                  ),
                  delete: () => {
                    setReleased("");
                  },
                  component: (toggleModal) => (
                    <Filter
                      data={online_status}
                      onClickAll={() => {
                        setReleased("");
                        toggleModal(false);
                      }}
                      onClick={(el) => {
                        setReleased(el.value);
                        toggleModal(false);
                      }}
                    />
                  ),
                },
              ]
            : [
                {
                  hidex: released === "",
                  label: (
                    <p>
                      {released ? "Released: " + released : "Released: All"}
                    </p>
                  ),
                  delete: () => {
                    setReleased("");
                  },
                  component: (toggleModal) => (
                    <Filter
                      data={online_status}
                      onClickAll={() => {
                        setReleased("");
                        toggleModal(false);
                      }}
                      onClick={(el) => {
                        setReleased(el.value);
                        toggleModal(false);
                      }}
                    />
                  ),
                },
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
                  label="Download Billing Units.csv"
                  icon={<FiDownload />}
                  onClick={() =>
                    dispatch(downloadBillingUnit(search, building))
                  }
                />,
              ]
        }
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <Button
                    color="Activated"
                    label="Upload Bulk"
                    icon={<FiUpload />}
                    onClick={() => setUpload(true)}
                  />,

                  <Button
                    color="Activated"
                    label="Upload Bulk Set As Paid"
                    icon={<FiUpload />}
                    onClick={() => {
                      if (role === "sa" && building == "") {
                        setAlert(true);
                        return;
                      }

                      setUploadSetAsPaid(true);
                    }}
                  />,

                  <Button label="Release All" onClick={handleShow} />,

                  <Button
                    color="Activated"
                    label="Release Selected"
                    disabled={Object.keys(selectedRowIds).length === 0}
                    onClick={() => {
                      setOpenReleaseWithSchedule(true);
                    }}
                  />,

                  <Button
                    color="Activated"
                    label="Set as Paid Selected"
                    disabled={Object.keys(selectedRowIds).length === 0}
                    icon={<FiCheck />}
                    onClick={() => {
                      confirmAlert({
                        title: "Set as Paid Billing",
                        message: "Do you want to set selected unit as Paid?",
                        buttons: [
                          {
                            label: "Yes",
                            onClick: () => {
                              dispatch(
                                updateSetAsPaidSelected(multiActionRows)
                              );
                            },
                            className: "Button btn btn-secondary",
                          },
                          {
                            label: "Cancel",
                            className: "Button btn btn-cancel",
                          },
                        ],
                      });
                    }}
                  />,
                ];
              }
        }
        onClickAddBilling={
          view
            ? null
            : (row) => {
                dispatch(setSelected(row));
                dispatch(setSelectedItem({building}));
                history.push(url + "/" + row.id + "/add");
              }
        }
      />
    </>
  );
}
export default Component;
