import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiDownload,
  FiUpload,
  FiHelpCircle,
  FiCheckCircle,
  FiDisc,
  FiCircle,
} from "react-icons/fi";

import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Button from "../../components/Button";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
  getBillingCategory,
  downloadBillingCategory,
  setSelectedItem,
  setSelected,
} from "../slices/billing";
import { endpointAdmin, endpointBilling } from "../../settings";
import { toSentenceCase, toMoney } from "../../utils";
import { get, post } from "../slice";

import Template from "./components/Template";
import UploadModal from "../../components/UploadModal";
import ModalWizard from "../../components/ModalWizard";
import ButtonWizard from "../../components/ButtonWizard";

function Component({ view, canAdd }) {
  const [search, setSearch] = useState("");

  const { role, user } = useSelector((state) => state.auth);

  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  const [limit, setLimit] = useState(5);
  const [upload, setUpload] = useState(false);
  const [openWizard, setOpenWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

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
    if (search.length === 0) setLimit(5);
  }, [search]);

  const columns = [
    // { Header: 'ID', accessor: 'code' },
    { Header: "Unit ID", accessor: "id" },
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
    // {
    //   Header: "Building",
    //   accessor: (row) => (
    //     <a className="Link" href={"/" + role + "/building/" + row.building_id}>
    //       {row.building_name}
    //     </a>
    //   ),
    // },
    {
      Header: "Resident",
      accessor: (row) =>
        row.resident_name ? toSentenceCase(row.resident_name) : "-",
    },
    { Header: "Month", accessor: (row) => row.month },
    { Header: "Year", accessor: (row) => row.year },
    { Header: "Service Name", accessor: (row) => row.service_name },
    { Header: "Paid Amount", accessor: (row) => toMoney(row.paid) },
    { Header: "Unpaid Amount", accessor: (row) => toMoney(row.unpaid) },
    // {
    //   Header: "Additional Charges",
    //   accessor: (row) => toMoney(row.additional_charge),
    // },
    // { Header: "Penalty", accessor: (row) => toMoney(row.billing_penalty) },
    {
      Header: "Total Amount",
      accessor: (row) => <b>{toMoney(row.total_all)}</b>,
    },
  ];

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
                            Upload Bulk
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
                            Download Data
                          </div>
                          <div className="wizard-body-container-bil">
                            Unduh semua data billing category <br />
                            dalam bentuk csv.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col"> </div>
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
                    melihat detail billing tersebut di Menu Billing &gt;
                    Category.
                  </li>
                  <li>
                    Kamu dapat menambahkan billing tambahan di detail billing
                    jika diperlukan.
                  </li>
                  <li>
                    Kamu dapat merelease billing tersebut kepada resident yang
                    bersangkutan.
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

        {/* Start of Wizard Download Billing Category */}
        {wizardStep === 6 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Download Billing Category
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
                        Download Billing Category
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Klik tombol <b>Download.csv</b>. Kamu dapat melihat semua
                informasi billing category lengkap dengan informasi resident
                tersebut.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/billing_category/step_1.gif")}
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
        {/* End of Wizard Download Billing Category */}
      </ModalWizard>
      {/* End of Web Wizard */}
      <UploadModal
        open={upload}
        toggle={() => setUpload(false)}
        templateLink={user.billing_bulk_template}
        filename="billing_unit_template.xlsx"
        uploadLink={endpointBilling + "/management/billing/upload"}
        uploadDataName="file_upload"
        resultComponent={uploadResult}
      />
      <Template
        pagetitle="Billing List Category"
        title="Unit"
        columns={columns}
        slice="billing"
        getAction={getBillingCategory}
        filterVars={[building, upload]}
        filters={
          role === "sa"
            ? [
                {
                  hidex: building === "",
                  label: <p>Building: {building ? buildingName : "All"}</p>,
                  delete: () => setBuilding(""),
                  component: (toggleModal) => (
                    <>
                      <Input
                        label="Search"
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
              ]
            : []
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
                  color="Download"
                  label="Download .csv"
                  icon={<FiDownload />}
                  onClick={() =>
                    dispatch(downloadBillingCategory(search, building))
                  }
                />,
              ]
        }
        actions={
          view
            ? null
            : [
                role === "bm" && !canAdd ? null : (
                  <Button
                    label="Upload Bulk"
                    icon={<FiUpload />}
                    onClick={() => setUpload(true)}
                  />
                ),
              ]
        }
        onClickAddBilling={
          view
            ? null
            : role === "bm" && !canAdd
            ? null
            : (row) => {
                dispatch(setSelected(row));
                dispatch(setSelectedItem({}));
                history.push(url + "/" + row.id + "/add");
              }
        }
      />
    </>
  );
}

export default Component;
