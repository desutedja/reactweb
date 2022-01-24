import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import Detail from "./components/Detail";
import Template from "./components/Template";

import Modal from "../../components/Modal";

import { endpointBilling } from "../../settings";
import { get } from "../slice";
import ThreeColumn from "../../components/ThreeColumn";
import Button from "../../components/Button";
import Popover from "../../components/Popover";
import Input from "../../components/Input";
import Row from "../../components/Row";
import Column from "../../components/Column";
import Table from "../../components/Table";
import TableWithSelection from "../../components/TableWithSelection";
import { Card, CardTitle, CardBody } from "reactstrap";
import Filter from "../../components/Filter";
import {
  dateTimeFormatterCell,
  toMoney,
  toEllipsis,
  toSentenceCase,
  dateFormatter,
  monthsArr,
} from "../../utils";
import {
  getBillingUnitItem,
  setSelectedItem,
  deleteBillingUnitItem,
  setSelected,
  updateSetAsPaidSelectedDetail,
} from "../slices/billing";
import { ListGroupItem, ListGroup } from "reactstrap";
import Pill from "../../components/Pill";
import { FiSearch, FiClock, FiPlus, FiCheck } from "react-icons/fi";
import BillingItem from "../../components/cells/BillingItem";
import moment from "moment";

const details = {
  "": ["resident_name", "building_name", "section_name", "number"],
};

const thisYear = moment().format("yyyy");
const lastYear = moment().subtract(1, "year").format("yyyy");

function Component({ view, canAdd, canUpdate }) {
  const [multiActionRows, setMultiActionRows] = useState([]);
  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  let { unitid } = useParams();

  const [confirmPaid, setConfirmPaid] = useState(false);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [data, setData] = useState({ items: [] });
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const [info, setInfo] = useState("");

  const [loading, setLoading] = useState(true);

  const [bmonths, setBmonths] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const { role } = useSelector((state) => state.auth);

  const { selected, unit, refreshToggle } = useSelector(
    (state) => state.billing
  );

  const columns = useMemo(() => {
    function isLate(payment, due_date, payment_date) {
      return payment === "paid"
        ? moment.utc(payment_date).isAfter(moment.utc(due_date))
        : moment.utc().isAfter(moment.utc(due_date));
    }

    return [
      { Header: "ID", accessor: "id" },
      {
        Header: "Name",
        accessor: (row) => (
          <BillingItem
            unitid={unitid}
            id={row.id}
            items={[
              row.name,
              <>
                {row.service_name} - {row.group === "ipl" ? "IPL" : "Non-IPL"}
              </>,
            ]}
          />
        ),
      },
      {
        Header: "Total",
        accessor: (row) => toMoney(row.total_amount),
      },
      { Header: "Due Date", accessor: (row) => dateFormatter(row.due_date) },
      {
        Header: "Due Penalty",
        accessor: (row) => toMoney(row.billing_penalty_amount),
      },
      {
        Header: "Ref Code",
        accessor: (row) =>
          row.ref_code ? (
            <Popover
              item={
                <a
                  class="Link"
                  href={
                    "/" +
                    role +
                    "/billing/unit/" +
                    unitid +
                    "/record/" +
                    row.ref_code
                  }
                >
                  {toEllipsis(row.ref_code, 10)}
                </a>
              }
              title={row.ref_code}
              placement="top"
            />
          ) : (
            "-"
          ),
      },
      {
        Header: "Payment",
        accessor: (row) =>
          row.payment_method === "cash" ? (
            <Pill color="primary">Cash Paid</Pill>
          ) : (
            <Pill color={row.payment === "paid" ? "success" : "secondary"}>
              {toSentenceCase(row.payment)}
            </Pill>
          ),
      },
      { Header: "Paid By", accessor: "paid_by" },
      {
        Header: "Payment Date",
        accessor: (row) =>
          row.payment_date ? (
            <div>
              <div>{dateTimeFormatterCell(row.payment_date)}</div>
              {isLate(row.payment, row.due_date, row.payment_date) && (
                <div style={{ color: "red" }}>
                  <FiClock /> Overdue Payment
                </div>
              )}
            </div>
          ) : (
            "-"
          ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    dispatch(
      get(
        endpointBilling +
          "/management/billing/unit/groupv3" +
          "?page=1&limit=999999&unit_id=" +
          unitid +
          "&search=" +
          search,
        (res) => {
          setBmonths(res.data.data.billing_months?.items);
          setInfo(res.data.data.info);
          dispatch(setSelected(res.data.data.info));
        }
      )
    );
  }, [dispatch, search, unitid]);

  return (
    <>
    {/* <Modal
        isOpen={settleModal}
        toggle={() => {
          setSettleModal(!settleModal);
          setSelected([]);
        }}
        title="Settlement Selection"
        okLabel="Flag as Settled"
        onClick={() => {
          const currentDate = new Date().toISOString();
          const trx_codes = [],
            additional_trx_codes = [];
          selected.map((el) => {
            if (el.payment_settled === 0) {
              trx_codes.push(el.trx_code);
            }
            if (el.additional_trx_code !== null) {
              additional_trx_codes.push(el.additional_trx_code);
            }
          });
          console.log(trx_codes);
          const dataSettle = {
            trx_codes,
            additional_trx_codes,
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
            const additional =
              el.additional_trx_code !== null &&
              el.additional_payment_settled != 1
                ? true
                : false;
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
                {!el.payment_settled_date && (
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
                )}
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
      </Modal> */}
      <Modal
        isOpen={confirmPaid}
        disableHeader={true}
        btnDanger
        onClick={() => {
          dispatch(updateSetAsPaidSelectedDetail(multiActionRows));
          setConfirmPaid(false);
        }}
        toggle={() => {
          setConfirmPaid(false);
        }}
        okLabel={"Yes"}
        cancelLabel={"Cancel"}
      >
        Do you want to set these selected billing as Paid?
      </Modal>
      <Template
        transparent
        pagetitle="Unit Billing Details"
        title={
          (role === "sa" ? toSentenceCase(info?.building_name) + ", " : "") +
          toSentenceCase(info?.section_type) +
          " " +
          toSentenceCase(info?.section_name) +
          " " +
          info?.number
        }
        loading={false}
        labels={[]}
        contents={[
          <div
            style={{
              display: "flex",
              marginTop: 16,
            }}
          >
            <Column style={{ flex: 2, display: "block" }}>
              <Card
                className="Container"
                style={{
                  boxShadow: "none",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h5> Billing Month </h5>
                </div>
                <ListGroup style={{ marginBottom: "10px", cursor: "pointer" }}>
                  <ListGroupItem
                    active={search === ""}
                    onClick={() => {
                      setSearch("");
                      setYear("");
                      setMonth("");
                      setActive("");
                    }}
                  >
                    All
                  </ListGroupItem>
                  <ListGroupItem
                    active={search === thisYear}
                    onClick={() => {
                      setSearch(thisYear);
                      setYear(thisYear);
                      setMonth("");
                      setActive("");
                    }}
                  >
                    This Year
                  </ListGroupItem>
                  <ListGroupItem
                    active={search === lastYear}
                    onClick={() => {
                      setSearch(lastYear);
                      setYear(lastYear);
                      setMonth("");
                      setActive("");
                    }}
                  >
                    Last Year
                  </ListGroupItem>
                  <ListGroupItem>
                    <Input
                      label={
                        lastYear +
                        ", " +
                        thisYear +
                        ", July " +
                        thisYear +
                        ", .."
                      }
                      compact
                      icon={<FiSearch />}
                      inputValue={search}
                      setInputValue={setSearch}
                    />
                  </ListGroupItem>
                </ListGroup>
                <div style={{ marginBottom: "10px" }}></div>
                <ListGroup>
                  {bmonths.length > 0 ? (
                    bmonths.map((el, index) => (
                      <ListGroupItem
                        style={{ cursor: "pointer" }}
                        active={index === active}
                        tag="b"
                        onClick={() => {
                          setActive(index);
                          setMonth(el.month);
                          setYear(el.year);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            {monthsArr[parseInt(el.month)]} {el.year}
                          </div>
                          <div>
                            {el.countpaid === 0 ? (
                              <Pill color="light">Unpaid</Pill>
                            ) : el.count - el.countpaid === 0 ? (
                              <Pill color="success">Paid</Pill>
                            ) : (
                              <Pill color="warning">Some Unpaid</Pill>
                            )}
                          </div>
                        </div>
                      </ListGroupItem>
                    ))
                  ) : (
                    <div style={{ padding: "10px 0px" }}>No Billing Yet</div>
                  )}
                </ListGroup>
              </Card>
            </Column>
            <Column style={{ display: "block", flex: 8 }}>
              <Row>
                <Column>
                  <Card
                    style={{
                      marginLeft: 16,
                      marginRight: 20,
                      marginBottom: 20,
                      flex: 2,
                    }}
                  >
                    <CardBody>
                      <CardTitle>
                        Unit Information
                        <hr />
                      </CardTitle>
                      <Detail
                        type="Billing"
                        data={info || {}}
                        labels={details}
                        editable={false}
                      />
                    </CardBody>
                  </Card>
                </Column>
                {
                  <Column>
                    <Card
                      style={{
                        marginRight: 16,
                        marginBottom: 20,
                        flex: 8,
                      }}
                    >
                      <CardBody>
                        <CardTitle>
                          Summary
                          <hr />
                        </CardTitle>
                        <ThreeColumn
                          second="Subtotal"
                          third={toMoney(data?.items?.group_amount)}
                        />
                        <ThreeColumn
                          second={"Penalty"}
                          third={
                            <span style={{ color: "red" }}>
                              {toMoney(data?.items?.group_penalty)}
                            </span>
                          }
                        />
                        <ThreeColumn
                          second="Total"
                          third={
                            <h4 className="m-0">
                              {toMoney(data?.items?.total_group_amount)}
                            </h4>
                          }
                        />
                      </CardBody>
                    </Card>
                  </Column>
                }
              </Row>
              <Row>
                <Card
                  className="Container"
                  style={{
                    flex: 4,
                    flexDirection: "column",
                    marginRight: 16,
                    boxShadow: "none",
                  }}
                >
                  <CardTitle>
                    <>
                      Billing Items{" "}
                      {active >= 0
                        ? bmonths[active]
                          ? "for " +
                            monthsArr[parseInt(bmonths[active]?.month)] +
                            " " +
                            bmonths[active]?.year
                          : year !== ""
                          ? "for Year " + year
                          : "all time"
                        : ""}
                    </>
                  </CardTitle>

                  {/* <Table */}
                  <TableWithSelection
                    columns={columns}
                    data={data?.items?.billing_items || []}
                    onSelection={(selectedRows) => {
                      const selectedRowIds = [];
                      selectedRows.map((row) => {
                        if (row !== undefined){
                          selectedRowIds.push(row.id);
                          setMultiActionRows([...selectedRowIds]);
                        }
                      });    
                    }}
                    fetchData={useCallback(
                      (page, limit, searchItem, sortField, sortType) => {
                        setLoading(true);
                        dispatch(
                          get(
                            endpointBilling +
                              "/management/billing/unit/groupv3/details" +
                              "?page=" +
                              (page + 1) +
                              "&limit=" +
                              limit +
                              "&month=" +
                              month +
                              "&year=" +
                              year +
                              "&unit_id=" +
                              unitid +
                              "&payment=" +
                              status +
                              "&search=" +
                              searchItem,
                            (res) => {
                              console.log(res.data.data);
                              setData(res.data.data);
                              setLoading(false);
                            }
                          )
                        );
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                      },
                      [dispatch, month, year, status, unitid, active]
                    )}
                    loading={loading}
                    pageCount={data?.total_pages}
                    totalItems={data?.total_items}
                    filters={[
                      {
                        label: (
                          <p>
                            {"Status: " +
                              (status ? toSentenceCase(status) : "All")}
                          </p>
                        ),
                        hidex: status === "",
                        delete: () => setStatus(""),
                        component: (toggleModal) => (
                          <>
                            <Filter
                              data={[
                                { label: "Paid", value: "paid" },
                                { label: "Unpaid", value: "unpaid" },
                              ]}
                              onClick={(el) => {
                                setStatus(el.value);
                                toggleModal(false);
                              }}
                              onClickAll={() => {
                                setStatus("");
                                toggleModal(false);
                              }}
                            />
                          </>
                        ),
                      },
                    ]}
                    actions={[
                      <>
                        {view ? null : role === "bm" && !canAdd ? null : (
                          <Button
                            key="Add Billing"
                            label="Add Billing"
                            icon={<FiPlus />}
                            onClick={() => {
                              dispatch(setSelectedItem({}));
                              history.push({
                                pathname: url + "/add",
                                state: {
                                  year: parseInt(bmonths[active]?.year),
                                  month: parseInt(bmonths[active]?.month),
                                },
                              });
                            }}
                          />
                        )}
                      </>,
                    ]}
                    deleteSelection={(selectedRows, rows) => {
                      Object.keys(selectedRows).map((el) =>
                        dispatch(deleteBillingUnitItem(rows[el].original.id))
                      );
                    }}
                    renderActions={
                      view
                        ? null
                        : (selectedRowIds, page) => {
                            return [
                              <>
                                <Button
                                  label="Set as Paid Selected"
                                  disabled={
                                    Object.keys(selectedRowIds).length === 0
                                  }
                                  icon={<FiCheck />}
                                  onClick={() => {
                                    confirmAlert({
                                      title: "Set as Paid Billing",
                                      message:
                                        "Do you want to set selected billing as Paid?",
                                      buttons: [
                                        {
                                          label: "Yes",
                                          onClick: () => {
                                            dispatch(
                                              updateSetAsPaidSelectedDetail(multiActionRows)
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
                                />
                              </>,
                            ];
                          }
                    }
                  />
                </Card>
              </Row>
            </Column>
          </div>,
        ]}
      />
    </>
  );
}

export default Component;
