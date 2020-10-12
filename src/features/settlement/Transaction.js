import React, { useRef, useCallback, useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiCheck, FiDownload, FiUpload } from "react-icons/fi";
import AnimatedNumber from "animated-number-react";
import moment from "moment";

import Breadcrumb from "../../components/Breadcrumb";
import Filter from "../../components/Filter";
import Modal from "../../components/Modal";
import Loading from "../../components/Loading";
import Table from "../../components/TableWithSelection";
import Button from "../../components/Button";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";
import {
  getTransactionDetails,
  getTransactionSettlement,
  refresh,
  downloadTransactionSettlement,
} from "../slices/transaction";
import { trxStatusColor } from "../../settings";
import {
  isRangeToday,
  toMoney,
  dateTimeFormatterCell,
  toSentenceCase,
} from "../../utils";
import { endpointTransaction } from "../../settings";
import Pill from "../../components/Pill";
import { get, post, getFile } from "../slice";
import MyButton from "../../components/Button";
import Transaction from "../../components/cells/Transaction";
import Merchant from "../../components/cells/Merchant";
import DateRangeFilter from "../../components/DateRangeFilter";

const status_settlement = [
  { label: "Settled", value: "settled" },
  { label: "Unsettled", value: "unsettled" },
];

const columns = [
  { Header: "ID", accessor: "id" },
  {
    Header: "Trx Code",
    accessor: (row) => (
      <Transaction
        items={[row.trx_code]}
        trxcode={row.trx_code}
        additionalTrxCode={row.additional_trx_code}
      />
    ),
  },
  {
    Header: "Merchant Name",
    accessor: (row) => (
      <Merchant id={row.merchant_id} items={["", <p>{row.merchant_name}</p>]} />
    ),
  },
  {
    Header: "Amount",
    accessor: (row) => (
      <div>
        <b>{toMoney(row.payment_amount - row.payment_charge)}</b>
        {row.additional_trx_code !== null && (
          <span style={{ fontSize: 12 }}>
            <br />
            Additional :{" "}
            <b>
              {toMoney(
                row.additional_payment_amount - row.additional_payment_charge
              )}
            </b>
          </span>
        )}
      </div>
    ),
  },
  {
    Header: "Settlement Status",
    accessor: (row) => {
      let additionalStlSts = null,
        mainColor = trxStatusColor["requested"],
        mainText = "unsettled",
        addColor = trxStatusColor["requested"],
        addText = "unsettled";
      if (row.additional_trx_code) {
        additionalStlSts = row.additional_payment_settled;
        if (additionalStlSts === 1) {
          addColor = trxStatusColor["paid"];
          addText = "settled";
        }
      }
      if (row.payment_settled === 1) {
        mainColor = trxStatusColor["paid"];
        mainText = "settled";
      }

      let mainPill = (
        <Badge pill color={mainColor}>
          {toSentenceCase(mainText)}
        </Badge>
      );
      let addPill = (
        <Badge pill color={addColor}>
          {toSentenceCase(addText)}
        </Badge>
      );

      return (
        <div>
          <div>
            <span style={{ fontSize: 12 }}>
              {additionalStlSts !== null && "Main:"}
            </span>
            {mainPill}
          </div>
          {additionalStlSts !== null && (
            <div>
              <span style={{ fontSize: 12 }}>Additional:</span> {addPill}
            </div>
          )}
        </div>
      );
    },
  },
  {
    Header: "Settlement Date",
    accessor: (row) =>
      row.payment_settled_date
        ? dateTimeFormatterCell(row.payment_settled_date)
        : "-",
  },
];

const formatValue = (value) => toMoney(value.toFixed(0));

function Component({ view }) {
  const [info, setInfo] = useState({});
  const { auth } = useSelector((state) => state);
  const templateLink = auth.user.settlement_bulk_template;

  const { loading, settlement, refreshToggle } = useSelector(
    (state) => state.transaction
  );

  const [statusSettlement, setStatusSettlement] = useState("");

  const today = moment().format("yyyy-MM-DD", "day");

  const [settleModal, setSettleModal] = useState(false);
  const [selected, setSelected] = useState([]);

  const fileInput = useRef();
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadResult, setUploadResult] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [settlementStart, setSettlementStart] = useState(
    moment().format("yyyy-MM-DD")
  );
  const [settlementEnd, setSettlementEnd] = useState(
    moment().format("yyyy-MM-DD")
  );

  let dispatch = useDispatch();

  const getSum = (items, additionalItem) => {
    let mainSum = items.reduce((sum, el) => {
      return (
        sum +
        (el.payment_amount - el.payment_charge) +
        (el.additional_payment_amount - el.additional_payment_charge)
      );
    }, 0);
    return mainSum;
  };

  useEffect(() => {
    dispatch(
      get(endpointTransaction + "/admin/transaction/summary", (res) => {
        setInfo(res.data.data);
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <>
      <h2 style={{ marginLeft: "16px", marginTop: "10px" }}>
        Transaction Settlement
      </h2>
      <Breadcrumb title="Settlement" />
      <Modal
        width="700px"
        isOpen={uploadModal}
        toggle={() => {
          setUploadResult("");
          setUploadModal(false);
        }}
        title="Upload Settlement"
        subtitle="Upload csv from Xendit dashboard"
        okLabel={
          uploadResult && uploadResult.valid_transactions.length > 0
            ? "Flag As Settled"
            : "Submit"
        }
        disablePrimary={
          loading ||
          (uploadResult && uploadResult.valid_transactions.length === 0)
        }
        disableSecondary={loading}
        onClick={
          uploadResult
            ? () => {
                const currentDate = new Date().toISOString();
                const trx_codes = uploadResult.valid_transactions.map(
                  (el) => el.trx_code
                );
                const dataSettle = {
                  trx_codes,
                  amount: getSum(selected),
                  settled_on: currentDate,
                };
                dispatch(
                  post(
                    endpointTransaction +
                      "/admin/transaction/settlement/create",
                    dataSettle,
                    (res) => {
                      setSettleModal(false);
                      dispatch(refresh());
                      dispatch(
                        setInfo({
                          message:
                            trx_codes.length +
                            " transaction" +
                            (trx_codes.length > 0 ? "s" : "") +
                            " was marked as settled",
                        })
                      );
                    }
                  )
                );
                setUploadResult("");
                setUploadModal(false);
              }
            : () => {
                setLoadingUpload(true);
                let formData = new FormData();
                formData.append("file", fileUpload);

                dispatch(
                  post(
                    endpointTransaction +
                      "/admin/transaction/settlement/validate/bulk",
                    formData,
                    (res) => {
                      setLoadingUpload(false);

                      setUploadResult(res.data.data);
                      console.log(res.data.data);
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
                  Valid Transaction Codes:{" "}
                  <span style={{ color: "green" }}>
                    {uploadResult.valid_transactions.length + " "}
                    result
                    {uploadResult.valid_transactions.length > 1 ? "s" : ""}
                  </span>
                </b>
              </div>
              {uploadResult.valid_transactions.map((el) => (
                <ListGroupItem
                  color={
                    el.payment_amount - el.payment_charge !== el.xendit_amount
                      ? "warning"
                      : "success"
                  }
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Trx Code</div>{" "}
                    <b>
                      Value: {toMoney(el.payment_amount - el.payment_charge)}
                    </b>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>{el.trx_code}</div>{" "}
                    <b>From Xendit: {toMoney(el.xendit_amount)}</b>
                  </div>
                  {el.payment_amount - el.payment_charge !==
                    el.xendit_amount && (
                    <div style={{ color: "red" }}>
                      There's difference between value of transaction and xendit
                      amount.
                    </div>
                  )}
                </ListGroupItem>
              ))}
            </ListGroup>
            <ListGroup>
              <div style={{ padding: "5px" }}>
                <b>
                  Invalid Transaction Codes:{" "}
                  <span style={{ color: "red" }}>
                    {uploadResult.invalid_transactions.length + " "}
                    result
                    {uploadResult.invalid_transactions.length > 1 ? "s" : ""}
                  </span>
                </b>
              </div>
              {uploadResult.invalid_transactions.map((el) => (
                <ListGroupItem color="danger">
                  {el.trx_code} ({el.reason})
                </ListGroupItem>
              ))}
            </ListGroup>
          </div>
        ) : (
          <Loading loading={loadingUpload}>
            <input
              ref={fileInput}
              type="file"
              className="d-block"
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
          setSelected([]);
        }}
        title="Settlement Selection"
        okLabel="Flag as Settled"
        onClick={() => {
          const currentDate = new Date().toISOString();
          const trx_codes = selected.map((el) => el.trx_code);
          const dataSettle = {
            trx_codes,
            amount: getSum(selected),
            settled_on: currentDate,
          };
          dispatch(
            post(
              endpointTransaction + "/admin/transaction/settlement/create",
              dataSettle,
              (res) => {
                setSettleModal(false);
                dispatch(refresh());
                dispatch(
                  get(
                    endpointTransaction + "/admin/transaction/summary",
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
          {selected.map((el) => {
            const additional = el.additional_trx_code !== null ? true : false;
            let additionalData = {},
              stlAdditionalItem = null;
            if (additional) {
              additionalData = {
                payment_charge:
                  el.additional_payment_amount - el.additional_payment_charge,
                trx_code: el.additional_trx_code,
              };
              stlAdditionalItem = (
                <div
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
                    {additionalData.trx_code}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {toMoney(additionalData.payment_charge)}
                  </div>
                </div>
              );
            }
            return (
              <div key={el.id}>
                {stlAdditionalItem}
                <div
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
                    {toMoney(el.payment_amount - el.payment_charge)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 16,
          }}
        >
          <h5>Total {toMoney(getSum(selected))}</h5>
        </div>
      </Modal>
      <div
        className="Container"
        style={{
          flex: "none",
          height: 120,
        }}
      >
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
              padding: "10px",
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
              value={info.total_settled_transaction_amount}
              formatValue={formatValue}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
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
              value={info.total_unsettled_transaction_amount}
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
              padding: "10px",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Merchant Disbursed Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_merchant_disbursed_transaction_amount}
              formatValue={formatValue}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Merchant Undisbursed Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_merchant_undisbursed_transaction_amount}
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
              padding: "10px",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Courier Disbursed Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_courier_disbursed_transaction_amount}
              formatValue={formatValue}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div
              style={{
                marginRight: 16,
              }}
            >
              Courier Undisbursed Amount
            </div>
            <AnimatedNumber
              className="BigNumber"
              value={info.total_courier_undisbursed_transaction_amount}
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
                getTransactionSettlement(
                  pageIndex,
                  pageSize,
                  search,
                  statusSettlement.value,
                  ...(statusSettlement.value === "settled"
                    ? [settlementStart, settlementEnd]
                    : [today, today])
                )
              );
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },
            [
              dispatch,
              refreshToggle,
              statusSettlement,
              settlementStart,
              settlementEnd,
            ]
          )}
          filters={[
            ...(statusSettlement.value === "settled"
              ? [
                  {
                    hidex: isRangeToday(settlementStart, settlementEnd),
                    label: "Settlement Date: ",
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
                ]
              : []),
            {
              hidex: statusSettlement === "",
              label: "Status: ",
              value: statusSettlement ? statusSettlement.label : "All",
              delete: () => {
                setStatusSettlement("");
              },
              component: (toggleModal) => (
                <>
                  <Filter
                    data={status_settlement}
                    onClick={(el) => {
                      setStatusSettlement(el);
                      toggleModal(false);
                    }}
                    onClickAll={() => {
                      setStatusSettlement("");
                      toggleModal(false);
                    }}
                  />
                </>
              ),
            },
          ]}
          actions={[]}
          renderActions={(selectedRowIds, page) => {
            // console.log(selectedRowIds);
            return [
              view ? null : (
                <Button
                  disabled={Object.keys(selectedRowIds).length === 0}
                  onClick={() => {
                    setSettleModal(true);
                  }}
                  icon={<FiCheck />}
                  label="Settle Selection"
                />
              ),
              view ? null : (
                <MyButton
                  label="Upload Settlement"
                  icon={<FiUpload />}
                  onClick={() => {
                    setUploadModal(true);
                  }}
                />
              ),
              <MyButton
                label="Download .csv"
                icon={<FiDownload />}
                onClick={() => {
                  dispatch(downloadTransactionSettlement(statusSettlement));
                }}
              />,
            ];
          }}
        />
      </div>
    </>
  );
}

export default Component;
