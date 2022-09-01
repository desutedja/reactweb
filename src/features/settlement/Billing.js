import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiCheck,
  FiFile,
  FiDownload,
  FiHelpCircle,
  FiDisc,
  FiCircle,
  FiCheckCircle,
} from "react-icons/fi";
import AnimatedNumber from "animated-number-react";
import { ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment";

import Table from "../../components/TableWithSelection";
import Loading from "../../components/Loading";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";
import ButtonWizard from "../../components/ButtonWizard";
import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Modal from "../../components/Modal";
import ModalWizard from "../../components/ModalWizard";
import Pill from "../../components/Pill";
import {
  getBillingSettlement,
  downloadBillingSettlement,
  refresh,
} from "../slices/billing";
import { endpointAdmin, endpointBilling } from "../../settings";
import {
  toMoney,
  dateTimeFormatterCell,
  isRangeToday,
  toSentenceCase,
} from "../../utils";
import { get, post, getFile } from "../slice";
import DateRangeFilter from "../../components/DateRangeFilter";

const formatValue = (value) => toMoney(value.toFixed(0));

function Component({ view, canUpdate, canDelete, canAdd }) {
  const { auth } = useSelector((state) => state);
  const { loading, settlement, refreshToggle } = useSelector(
    (state) => state.billing
  );
  const templateLink = auth.user.settlement_bulk_template;

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  const [settled, setSettled] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  const [info, setInfo] = useState({});

  const [settleModal, setSettleModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const fileInput = useRef();
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  const today = moment().format("yyyy-MM-DD", "day");
  const monthStart = moment().startOf("month").format("yyyy-MM-DD");
  const monthStartAdmin = moment().subtract("month", 3).format("yyyy-MM-DD");
  const monthEnd = moment().endOf("month").format("yyyy-MM-DD");
  const [settlementStart, setSettlementStart] = useState(monthStartAdmin);
  const [settlementEnd, setSettlementEnd] = useState(today);
  const [startDate, setStartDate] = useState(monthStart);
  const [endDate, setEndDate] = useState(monthEnd);
  const [openWizard, setOpenWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  let dispatch = useDispatch();

  const getSum = (items) => {
    return items.reduce((sum, el) => {
      return sum + el.selling_price;
    }, 0);
  };

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "Ref Code",
        accessor: (row) => (
          <Link
            class="Link"
            to={"/" + auth.role + "/billing/settlement/" + row.trx_code}
          >
            <b>{row.trx_code}</b>
          </Link>
        ),
      },
      {
        Header: "Unit",
        accessor: (row) => (
          <>
            {toSentenceCase(row.section_type)}{" "}
            {toSentenceCase(row.section_name)} {row.number}
          </>
        ),
      },
      { Header: "Building", accessor: "building_name" },
      { Header: "Amount", accessor: (row) => toMoney(row.selling_price) },
      {
        Header: "Settled",
        accessor: (row) =>
          auth.role === "bm" ? (
            row.payment_settled === 1 ? (
              <Pill color="success">Settled</Pill>
            ) : (
              <Pill color="secondary">Unsettled</Pill>
            )
          ) : row.payment_settled_date ? (
            <Pill color="success">Settled</Pill>
          ) : (
            <Pill color="secondary">Unsettled</Pill>
          ),
      },
      {
        Header: "Settlement Date",
        accessor: (row) =>
          auth.role === "bm"
            ? row.disbursement_date
              ? dateTimeFormatterCell(row.disbursement_date)
              : "- "
            : row.payment_settled_date
            ? dateTimeFormatterCell(row.payment_settled_date)
            : "-",
      },
    ],
    [auth]
  );

  useEffect(() => {
    console.log(columns);
    if (auth.role === "bm") {
      console.log(columns);
      return;
    }
  }, [auth.role, columns]);

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

            setBuildings(formatted);
          }
        )
      );
  }, [dispatch, limit, search]);

  useEffect(() => {
    if (search.length === 0) setLimit(5);
  }, [search]);

  useEffect(() => {
    dispatch(
      get(endpointBilling + "/management/billing/statistic", (res) => {
        setInfo(res.data.data);
      })
    );
  }, [dispatch]);

  return (
    <div>
      <h2 style={{ marginLeft: "16px", marginTop: "10px" }}>
        Billing Settlement
      </h2>
      <Breadcrumb title="Settlement" />
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
                            Apa Billing Settlement?
                          </div>
                          <div className="wizard-body-container-bil">
                            Hal apa saja yang dapat kamu lihat <br />
                            pada halaman billing settlement.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(3);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Detail Billing Settlement
                          </div>
                          <div className="wizard-body-container-bil">
                            Lihat semua data billing settlement <br />
                            resident.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div
                      className="Container-wizard-bil border-wizard-bil d-flex flex-column"
                      onClick={() => {
                        setWizardStep(5);
                      }}
                    >
                      <div className="row no-gutters">
                        <div className="col">
                          <div className="text-nowrap wizard-title-container-bil">
                            Download Data
                          </div>
                          <div className="wizard-body-container-bil">
                            Unduh semua data billing settlement <br />
                            dalam bentuk csv.
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

        {/* Start of Wizard Billing Settlement */}
        {wizardStep === 2 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Apa Billing Settlement?
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
                        Fungsi Billing Settlement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Pada halaman Billing Settlement, kamu dapat melihat jumlah
                billing dengan status Unsettled maupun Settled.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/billing_settlement/step_1.gif")}
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
        {/* End of Wizard Billing Settlement */}

        {/* Start of Wizard Detail Billing Settlement */}
        {wizardStep === 3 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Detail Billing Settlement
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
                        Informasi Resident
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
                        Informasi Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Pada halaman Billing Settlement, pilih salah satu data billing.
                Lalu kamu bisa melihat informasi resident yang bersangkutan.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/billing_settlement/step_2.gif")}
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
                    setWizardStep(4);
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
        {wizardStep === 4 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Detail Billing Settlement
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
                        Informasi Resident
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
                        Informasi Billing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Setelah masuk ke halaman Paid Details, scroll hingga bagian
                paling bawah.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/billing_settlement/step_3.gif")}
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
        {/* End of Wizard Detail Billing Settlement */}

        {/* Start of Wizard Download Data Settlement */}
        {wizardStep === 5 && (
          <>
            <div className="row">
              <div className="col wizard-header ml-4 mb-4 mt-4">
                Download Data Settlement
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
                        Download Data Billing Settlement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col wizard-body ml-4 mt-4">
                Pada halaman Billing Settlement, click tombol{" "}
                <b>Download.csv</b> pada bagian kanan halaman.
              </div>
            </div>
            <div className="col-auto mt-5 mb-5">
              <div
                className="w-auto text-center"
                style={{ animation: "fadeIn 3s" }}
              >
                <img
                  src={require("../../assets/wizard/billing/billing_settlement/step_4.gif")}
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
        {/* End of Wizard Download Data Settlement */}
      </ModalWizard>
      {/* End of Web Wizard */}
      <Modal
        isOpen={uploadModal}
        toggle={() => {
          setUploadResult();
          setUploadModal(false);
        }}
        title="Upload Settlement"
        subtitle="Upload file type .xlsx for bulk settlement"
        okLabel={uploadResult ? "Done" : "Submit"}
        disablePrimary={loading}
        disableSecondary={loading}
        onClick={
          uploadResult
            ? () => {
                setUploadResult("");
                setUploadModal(false);
              }
            : () => {
                setLoadingUpload(true);

                let formData = new FormData();
                formData.append("file", fileUpload);

                dispatch(
                  post(
                    endpointBilling +
                      "/management/billing/settlement/bulksettlement",
                    formData,
                    (res) => {
                      setLoadingUpload(false);

                      setUploadResult(res.data.data);
                    },
                    (err) => {
                      setLoadingUpload(false);
                    }
                  )
                );
              }
        }
      >
        {uploadResult ? (
          <div style={{ maxHeight: "600px", overflow: "scroll" }}>
            <ListGroup style={{ marginBottom: "15px" }}>
              <div style={{ padding: "5px" }}>
                <b>
                  Settled Transaction:
                  {uploadResult.settled !== null ? (
                    <span style={{ color: "green" }}>
                      {uploadResult.settled.length + " "}
                      result{uploadResult.settled.length > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>0 result</span>
                  )}
                </b>
              </div>
            </ListGroup>
            <ListGroup style={{ marginBottom: "15px" }}>
              <div style={{ padding: "5px" }}>
                <b>
                  Already Settled Transaction:
                  {uploadResult.already_settled !== null ? (
                    <span style={{ color: "green" }}>
                      {uploadResult.count_already_settled + " "}
                      result{uploadResult.count_already_settled > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "green" }}>0 result</span>
                  )}
                </b>
              </div>
            </ListGroup>
            <ListGroup>
              <div style={{ padding: "5px" }}>
                <b>
                  Unsettled Transaction:
                  {uploadResult.unsettled !== null ? (
                    <span style={{ color: "red" }}>
                      {uploadResult.unsettled.length + " "}
                      result{uploadResult.unsettled.length > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>0 result</span>
                  )}
                </b>
              </div>
            </ListGroup>
          </div>
        ) : (
          <Loading loading={loadingUpload}>
            <input
              className="d-block"
              ref={fileInput}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              type="file"
              onChange={(e) => {
                setFileUpload(fileInput.current.files[0]);
              }}
            />
            <button
              onClick={() => {
                setLoadingUpload(true);
                dispatch(
                  getFile(
                    templateLink,
                    "billing_settlement_template.csv",
                    (res) => {
                      setLoadingUpload(false);
                    },
                    (err) => {
                      setLoadingUpload(false);
                    }
                  )
                );
              }}
              style={{
                marginTop: 16,
                color: "white",
              }}
            >
              Download Template
            </button>
          </Loading>
        )}
      </Modal>
      <Modal
        isOpen={settleModal}
        toggle={() => {
          setSettleModal(!settleModal);
        }}
        title="Settlement Selection"
        okLabel="Settle"
        onClick={() => {
          dispatch(
            post(
              endpointBilling + "/management/billing/settlement",
              {
                trx_code: selected.map((el) => el.trx_code),
              },
              (res) => {
                dispatch(refresh());
                setSettleModal(false);
                dispatch(
                  get(
                    endpointBilling + "/management/billing/settlement/info",
                    (res) => {
                      setInfo(res.data.data);
                    }
                  )
                );
              }
            )
          );
        }}
      >
        <div
          style={{
            minHeight: 300,
          }}
        >
          {selected.map((el) => (
            <div
              key={el.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                padding: 8,
                marginBottom: 4,
                border: "1px solid silver",
                borderRadius: 4,
              }}
            >
              <div>
                <div>Trx Code</div>
                {el.trx_code}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {toMoney(el.selling_price)}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
          }}
        >
          <h5>Total {toMoney(getSum(selected))}</h5>
        </div>
      </Modal>
      <div className="Container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Unsettled Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_unsettle_amount}
              formatValue={formatValue}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Settled Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_settle_amount}
              formatValue={formatValue}
            />
          </div>
        </div>
      </div>
      <div className="Container">
        <Table
          totalItems={settlement.total_items}
          onSelection={(selectedRows) => {
            setSelected(
              selectedRows.filter((el) => el && !el.payment_settled_date)
            );
          }}
          columns={columns}
          data={settlement.items}
          loading={loading}
          pageCount={settlement.total_pages}
          fetchData={useCallback(
            (pageIndex, pageSize, search) => {
              dispatch(
                getBillingSettlement(
                  pageIndex,
                  pageSize,
                  search,
                  building,
                  settled,
                  ...(auth.role === "sa"
                    ? [settlementStart, settlementEnd]
                    : auth.role === "bm"
                    ? [startDate, endDate]
                    : [today, today])
                )
              );
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },
            [
              dispatch,
              auth.role,
              refreshToggle,
              building,
              settled,
              settlementStart,
              settlementEnd,
              startDate,
              endDate,
            ]
          )}
          filters={
            auth.role === "sa"
              ? [
                  {
                    hidex: isRangeToday(settlementStart, settlementEnd),
                    label: "Date: ",
                    delete: () => {
                      setSettlementStart(today);
                      setSettlementEnd(today);
                    },
                    value: isRangeToday(settlementStart, settlementEnd)
                      ? "Today"
                      : moment(settlementStart).format("DD-MM-yyyy") +
                        " - " +
                        moment(settlementEnd).format("DD-MM-yyyy"),
                    component: (toggleModal) => (
                      <DateRangeFilter
                        startDate={settlementStart}
                        endDate={settlementEnd}
                        onApply={(start, end) => {
                          setSettlementStart(start);
                          setSettlementEnd(end);
                          toggleModal();
                        }}
                      />
                    ),
                  },
                  {
                    hidex: settled === "",
                    label: (
                      <p>
                        Status:{" "}
                        {settled
                          ? settled === "1"
                            ? "Settled"
                            : "Unsettled"
                          : "All"}
                      </p>
                    ),
                    delete: () => setSettled(""),
                    component: (toggleModal) => (
                      <Filter
                        data={[
                          { value: "0", label: "Unsettled" },
                          { value: "1", label: "Settled" },
                        ]}
                        onClick={(el) => {
                          setSettled(el.value);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setSettled("");
                          toggleModal(false);
                        }}
                      />
                    ),
                  },
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
                          }}
                          onClickAll={() => {
                            setBuilding("");
                            setBuildingName("");
                            toggleModal(false);
                            setSearch("");
                          }}
                        />
                      </>
                    ),
                  },
                ]
              : [
                  {
                    hidex: isRangeToday(startDate, endDate),
                    label: "Date: ",
                    delete: () => {
                      setStartDate(monthStart);
                      setEndDate(monthEnd);
                    },
                    value: isRangeToday(startDate, endDate)
                      ? "Today"
                      : moment(startDate).format("DD-MM-yyyy") +
                        " - " +
                        moment(endDate).format("DD-MM-yyyy"),
                    component: (toggleModal) => (
                      <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onApply={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                          toggleModal();
                        }}
                      />
                    ),
                  },
                  {
                    hidex: settled === "",
                    label: (
                      <p>
                        Status:{" "}
                        {settled
                          ? settled === "1"
                            ? "Settled"
                            : "Unsettled"
                          : "All"}
                      </p>
                    ),
                    delete: () => setSettled(""),
                    component: (toggleModal) => (
                      <Filter
                        data={[
                          { value: "0", label: "Unsettled" },
                          { value: "1", label: "Settled" },
                        ]}
                        onClick={(el) => {
                          setSettled(el.value);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setSettled("");
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
                    label="Download.csv"
                    icon={<FiDownload />}
                    onClick={() =>
                      dispatch(
                        downloadBillingSettlement(
                          search,
                          building,
                          settled,
                          ...(settled === "1"
                            ? [settlementStart, settlementEnd]
                            : [])
                        )
                      )
                    }
                  />,
                ]
          }
          renderActions={(selectedRowIds, page) => {
            return [
              view
                ? null
                : auth.role === "sa" && (
                    <Button
                      disabled={Object.keys(selectedRowIds).length === 0}
                      onClick={() => {
                        setSettleModal(true);
                      }}
                      icon={<FiCheck />}
                      label="Settle"
                    />
                  ),
              view
                ? null
                : auth.role === "sa" && (
                    <Button
                      onClick={() => {
                        setUploadModal(true);
                      }}
                      icon={<FiFile />}
                      label="Upload Settlement"
                    />
                  ),
            ];
          }}
        />
      </div>
    </div>
  );
}

export default Component;
