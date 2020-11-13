import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@material-ui/lab";
import { Rating } from "@material-ui/lab";

// import Detail from '../components/Detail';
import Modal from "../../../components/Modal";
import Resident from "../../../components/cells/Resident";
import Staff from "../../../components/cells/Staff";
import Row from "../../../components/Row";
import Column from "../../../components/Column";
import Template from "../components/Template";
import ThreeColumn from "../../../components/ThreeColumn";
import TwoColumn from "../../../components/TwoColumn";
import { FiArrowUpRight, FiCalendar, FiAlertCircle } from "react-icons/fi";
import Button from "../../../components/Button";

import { Card, CardFooter, CardTitle, CardBody } from "reactstrap";

import Product from "../../../components/cells/Product";
import Pill from "../../../components/Pill";
// import Orders from './contents/Orders';
import { useParams } from "react-router-dom";
import { get } from "../../slice";
import { completedTransaction, setSelected } from "../../slices/transaction";
import { endpointTransaction } from "../../../settings";
import { toMoney, dateTimeFormatter, toSentenceCase } from "../../../utils";
import { Form } from "formik";
import { Input } from "@material-ui/core";

function Component() {
  const [data, setData] = useState({});
  const [completed, setCompleted] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [ratingError, setRatingError] = useState(false);
  const [completeReview, setCompleteReview] = useState({
    transaction_id: "",
    rating: 0,
    comment: "",
  });

  let dispatch = useDispatch();
  let { id } = useParams();

  const [history, setHistory] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const { refreshToggle } = useSelector((state) => state.transaction);

  useEffect(() => {
    dispatch(
      get(endpointTransaction + "/admin/transaction/" + id, (res) => {
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        if (
          res.data.data.status === "delivered" ||
          res.data.data.status === "paid"
        ) {
          setCompleteReview({
            ...completeReview,
            transaction_id: res.data.data.id.toString(),
          });
        }
        console.log(res.data.data);
      })
    );
  }, [dispatch, id, refreshToggle]);

  return (
    <>
      <Modal
        width="750px"
        title="Transaction History"
        disableFooter={true}
        isOpen={history}
        toggle={() => setHistory(false)}
      >
        <Timeline align="alternate">
          {data.transaction_logs &&
            data.transaction_logs.map((el, index) => (
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  {index === data.transaction_logs.length - 1 || (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <b>{toSentenceCase(el.status)}</b>
                  <div>{dateTimeFormatter(el.created_on)}</div>
                  <div>{el.description}</div>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </Modal>

      <Modal
        width="750px"
        isOpen={completed}
        toggle={() => setCompleted(false)}
        title={`Set Transaction as Completed`}
        okLabel="Yes"
        onClick={() => {
          setCommentError(completeReview.comment === "" ? true : false);
          setRatingError(completeReview.rating === 0 ? true : false);
          console.log(completeReview);
          if (completeReview.rating > 0 && completeReview.comment.length > 0) {
            dispatch(completedTransaction([completeReview]));
          }
          setCompleted(false);
        }}
        cancelLabel="No"
        onClickSecondary={() => {
          setCompleted(false);
        }}
      >
        <Row>
          <Column flex={1}>Transaction Code</Column>
          <Column flex={0.5}>:</Column>
          <Column flex={2}>{data.trx_code}</Column>
        </Row>
        <Row>
          <Column flex={1}>Rating</Column>
          <Column flex={0.5}>:</Column>
          <Column flex={2}>
            <Rating
              value={completeReview.rating}
              size="large"
              onChange={(_, value) => {
                setCompleteReview({
                  ...completeReview,
                  rating: value,
                });
                setRatingError(value <= 0 ? true : false);
              }}
            ></Rating>
          </Column>
        </Row>
        <Row>
          <Column flex={1}>Comment</Column>
          <Column flex={0.5}>:</Column>
          <Column flex={2}>
            <Input
              style={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: 14,
              }}
              multiline
              value={completeReview.comment}
              error={ratingError}
              onChange={(e) => {
                setCompleteReview({
                  ...completeReview,
                  comment: e.target.value,
                });
                setCommentError(e.target.value.length <= 0 ? true : false);
              }}
            />
          </Column>
        </Row>
        {(ratingError || commentError) && (
          <Row>
            <div
              className="Input-error"
              style={{
                marginTop: 16,
              }}
            >
              <FiAlertCircle
                style={{
                  marginRight: 4,
                }}
              />
              Your form is incomplete or there are some errors in your form.
            </div>
          </Row>
        )}
      </Modal>
      <Template
        transparent
        title={data.trx_code}
        loading={!data.id}
        labels={["Details"]}
        contents={[
          <>
            <Row>
              <Column style={{ width: "80%" }}>
                <Card style={{ marginRight: "20px", marginBottom: "20px" }}>
                  <CardBody>
                    <Row
                      style={{
                        justifyContent: "space-between",
                        alignItems: "bottom",
                      }}
                    >
                      <CardTitle>
                        <h5>Summary</h5>
                        <div>Transaction Code : {data.trx_code}</div>
                        <div>Type : {toSentenceCase(data.type)}</div>
                      </CardTitle>
                      <div style={{ display: "block", textAlign: "right" }}>
                        <Pill
                          color={
                            data.payment === "paid" ? "success" : "secondary"
                          }
                        >
                          {toSentenceCase(data.payment)}
                        </Pill>
                        {data.payment === "paid" && (
                          <div style={{ paddingTop: "5px" }}>
                            via {toSentenceCase(data.payment_method)} (
                            {data.payment_bank.toUpperCase()})
                          </div>
                        )}
                      </div>
                    </Row>
                    <div
                      style={{
                        borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
                        padding: "10px 0px",
                      }}
                    >
                      {data.items &&
                        data.items.map((el) => (
                          <>
                            <ThreeColumn
                              first={
                                <Product
                                  id={el.item_id}
                                  data={{
                                    id: el.item_id,
                                    thumbnails: el.item_thumbnails,
                                    name: el.item_name,
                                    merchant_name: data.merchant_name,
                                  }}
                                />
                              }
                              second={
                                el.qty + (" item" + (el.qty > 1 ? "s" : ""))
                              }
                              third={toMoney(el.total_price)}
                            />
                            <div>
                              {el.remarks_resident && (
                                <div style={{ padding: "0px 10px" }}>
                                  <small>
                                    Resident note: {el.remarks_resident}
                                  </small>
                                </div>
                              )}
                              {el.remarks_merchant && (
                                <div style={{ padding: "0px 10px" }}>
                                  <small>
                                    Merchant note: {el.remarks_merchant}
                                  </small>
                                </div>
                              )}
                            </div>
                          </>
                        ))}
                    </div>
                    {data.items && (
                      <ThreeColumn
                        second="Subtotal"
                        third={toMoney(
                          data.items.reduce(
                            (sum, el) => sum + el.total_price,
                            0
                          )
                        )}
                      />
                    )}
                    <ThreeColumn
                      second="Total Selling Price"
                      third={toMoney(data.total_selling_price)}
                    />
                    {data.discount_code && (
                      <ThreeColumn
                        second="Discount Code"
                        third={toMoney(data.discount_code)}
                      />
                    )}
                    <ThreeColumn
                      second={"Tax (" + data.tax_type + ")"}
                      third={toMoney(data.tax_price)}
                    />
                    <ThreeColumn
                      second="Discount"
                      third={
                        <span style={{ color: "red" }}>
                          {"-" + toMoney(data.discount_price)}
                        </span>
                      }
                    />
                    <ThreeColumn
                      second="Internal Courier Charge"
                      third={toMoney(data.courier_internal_charges)}
                    />
                    <ThreeColumn
                      second="External Courier Charge"
                      third={toMoney(data.courier_external_charges)}
                    />
                    <ThreeColumn
                      second="Courier Merchant Charge"
                      third={toMoney(data.courier_merchant_charges)}
                    />
                    <ThreeColumn
                      second="Markup delivery"
                      third={toMoney(data.profit_from_delivery)}
                    />
                    <ThreeColumn
                      second="PG Fee"
                      third={toMoney(data.payment_charge)}
                    />
                    <ThreeColumn
                      second="Voucher Code"
                      third={data.voucher_code}
                    />
                    <ThreeColumn
                      second="Total Voucher Discount"
                      third={toMoney(data.total_voucher_discount)}
                    />
                    <ThreeColumn
                      second={<b>Total Paid Amount</b>}
                      third={<b>{toMoney(data.payment_amount)}</b>}
                    />
                    <hr />
                    <ThreeColumn
                      second="Profit From Delivery"
                      third={toMoney(data.profit_from_delivery)}
                    />
                    <ThreeColumn
                      second="Profit From Product"
                      third={toMoney(data.profit_from_sales)}
                    />
                    <ThreeColumn
                      second="Profit From PG"
                      third={toMoney(data.profit_from_pg)}
                    />
                    <ThreeColumn
                      second={<b>Total Profit</b>}
                      third={
                        <b>
                          {toMoney(
                            data.profit_from_delivery +
                              data.profit_from_sales +
                              data.profit_from_pg -
                              data.discount_price
                          )}
                        </b>
                      }
                    />
                  </CardBody>
                  <CardFooter>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5>Merchant</h5>
                      <div>
                        <a
                          style={{
                            textDecoration: "none",
                            color: "black",
                            fontWeight: "bold",
                          }}
                          href={"/sa/merchant/" + data.merchant_id}
                        >
                          {data.merchant_name}
                        </a>
                      </div>
                    </div>
                    {data.type === "services" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: "5px",
                        }}
                      >
                        <div>Appointment</div>
                        <div>
                          <FiCalendar />{" "}
                          {dateTimeFormatter(data.appointment_datetime)}{" "}
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>

                {data.additional_trx_code !== null && (
                  <Card style={{ marginBottom: "20px", marginRight: "20px" }}>
                    <CardBody>
                      <Row
                        style={{
                          justifyContent: "space-between",
                          alignItems: "bottom",
                        }}
                      >
                        <CardTitle>
                          <h5>Add On Transaction</h5>
                          Transaction Code : {data.additional_trx_code}
                        </CardTitle>
                        <div style={{ display: "block", textAlign: "right" }}>
                          <Pill
                            color={
                              data.additional_trx_status === "paid"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {toSentenceCase(data.additional_trx_status)}
                          </Pill>
                          {data.additional_trx_status === "paid" && (
                            <div style={{ paddingTop: "5px" }}>
                              via{" "}
                              {toSentenceCase(data.additional_payment_method)} (
                              {data.additional_payment_bank.toUpperCase()})
                            </div>
                          )}
                        </div>
                      </Row>
                      {data.addons &&
                        data.addons.length > 0 &&
                        data.addons.map((el, index) => {
                          return (
                            <div
                              style={{
                                borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
                                padding: "10px 0px",
                              }}
                            >
                              <ThreeColumn
                                noborder={false}
                                first={
                                  <Product
                                    disabled
                                    noThumbnail
                                    id={`${el.item_name}-${index}`}
                                    data={{
                                      id: `${el.item_name}-${index}`,
                                      thumbnails: null,
                                      name: el.item_name,
                                      merchant_name: data.merchant_name,
                                    }}
                                  />
                                }
                                third={toMoney(el.item_price)}
                              />
                              <div>
                                {el.remarks && (
                                  <div style={{ padding: "0px 10px" }}>
                                    <small>Note: {el.remarks}</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      <ThreeColumn
                        noborder={false}
                        second="Subtotal"
                        third={toMoney(data.service_additional_price)}
                      />
                      <ThreeColumn
                        second="PG Fee"
                        third={
                          data.additional_payment_charge === 0
                            ? toMoney(
                                data.additional_payment_amount -
                                  data.service_additional_price
                              )
                            : toMoney(data.additional_payment_charge)
                        }
                      />
                      <ThreeColumn
                        second={<b>Total Paid Amount</b>}
                        third={<b>{toMoney(data.additional_payment_amount)}</b>}
                      />
                      <hr />
                    </CardBody>
                  </Card>
                )}
              </Column>
              <Column style={{ width: "20%", display: "block" }}>
                <Row>
                  <Card style={{ width: "100%", marginBottom: "20px" }}>
                    <CardBody>
                      <CardTitle>
                        <h5>Resident</h5>
                      </CardTitle>
                      <Row>
                        <div
                          style={{
                            width: "50%",
                            borderRight: "1px solid rgba(0,0,0,0.125)",
                          }}
                        >
                          <Resident
                            id={data.resident_id}
                            data={{
                              photo: data.resident_photo,
                              firstname: data.resident_name,
                              lastname: "",
                              email: data.resident_email,
                            }}
                          />
                        </div>
                        <div style={{ width: "50%", paddingLeft: "10px" }}>
                          <b>Address</b>
                          <div>{data.resident_address}</div>
                          <div>{data.resident_building_unit_id}</div>
                          <div>{data.resident_building_id}</div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </Row>
                <Row>
                  <Card style={{ marginBottom: "20px", width: "100%" }}>
                    <CardBody>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <CardTitle>
                          <h5>Status</h5>
                        </CardTitle>
                        <div class="Link" onClick={() => setHistory(true)}>
                          See History
                        </div>
                      </div>
                      <Pill>{toSentenceCase(data.status)}</Pill>
                    </CardBody>

                    {(data.status === "delivered" || data.status === "paid") &&
                      completed === false && (
                        <CardFooter style={{ textAlign: "right" }}>
                          <Button
                            onClick={() => setCompleted(true)}
                            // icon={<FiCheck />}
                            label="Set As Completed"
                          />
                        </CardFooter>
                      )}
                  </Card>
                </Row>

                {data.status === "completed" && (
                  <Card style={{ marginBottom: "20px" }}>
                    <CardBody>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <CardTitle>
                          <h5>Transaction Rating</h5>
                        </CardTitle>
                      </div>
                      <Rating
                        name="rating_transaction"
                        value={data.rating}
                        readOnly
                      />
                      <div>
                        {data.rating_comment ? (
                          data.rating_comment
                        ) : (
                          <i>No rating comment</i>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                )}
                {data.type === "goods" && (
                  <Row>
                    <Card style={{ marginBottom: "20px", width: "100%" }}>
                      <CardBody>
                        <CardTitle>
                          <h5>Delivery Information</h5>
                        </CardTitle>
                        <Row>
                          <div
                            style={{
                              width: "30%",
                              borderRight: "1px solid rgba(0,0,0,0.125)",
                            }}
                          >
                            <b>Method</b>
                            <div>{data.courier_provider}</div>
                          </div>
                          <div
                            style={{
                              width: "30%",
                              borderRight: "1px solid rgba(0,0,0,0.125)",
                              paddingLeft: "10px",
                            }}
                          >
                            <b>External Courier</b>
                            <div>
                              Type :{" "}
                              {data.delivery_type !== "internal"
                                ? data.delivery_type
                                : "-"}
                            </div>
                            <div>
                              Tracking Code :{" "}
                              {data.courier_tracking_code || "-"}
                            </div>
                            <div>
                              Courier Name : {data.courier_external_name || "-"}
                            </div>
                            <div>
                              Courier Phone :{" "}
                              {data.courier_external_phone || "-"}
                            </div>
                            <div>
                              Courier Status :{" "}
                              {data.courier_external_status || "-"}
                            </div>
                          </div>
                          <div style={{ width: "30%", paddingLeft: "10px" }}>
                            <b>Internal Courier</b>
                            {data.courier_internal_id ? (
                              <>
                                <div>
                                  {" "}
                                  Task ID :
                                  <a
                                    class="Link"
                                    href={"/" + role + "/task/" + data.task_id}
                                  >
                                    {" "}
                                    {data.task_id}
                                    <FiArrowUpRight size="17" />{" "}
                                  </a>
                                </div>
                                <div> Assignee : </div>
                                <Staff
                                  id={data.courier_internal_id}
                                  data={{
                                    firstname: data.courier_internal_name,
                                    lastname: "",
                                    email: data.courier_internal_email,
                                    phone: data.courier_internal_phone,
                                    staff_role: "courier",
                                  }}
                                />
                              </>
                            ) : (
                              <div>-</div>
                            )}
                          </div>
                        </Row>
                      </CardBody>
                    </Card>
                  </Row>
                )}
                {data.payment === "paid" && data.status === "completed" && (
                  <Row style={{ justifyContent: "space-between" }}>
                    <Card
                      style={{
                        marginBottom: "20px",
                        width: "50%",
                        marginRight: "20px",
                      }}
                    >
                      <CardBody>
                        <CardTitle>
                          <h5>Settlement</h5>
                        </CardTitle>
                        <Row>
                          <TwoColumn
                            first="Status :"
                            second={
                              <Pill
                                color={
                                  data.payment_settled ? "success" : "secondary"
                                }
                              >
                                {data.payment_settled === 1
                                  ? "Settled"
                                  : "Unsettled"}
                              </Pill>
                            }
                          />
                        </Row>
                        {data.payment_settled === 1 && (
                          <Row>
                            <TwoColumn
                              first=" "
                              second={dateTimeFormatter(
                                data.payment_settled_date
                              )}
                            />
                          </Row>
                        )}
                      </CardBody>
                    </Card>
                    <Card style={{ marginBottom: "20px", width: "50%" }}>
                      <CardBody>
                        <CardTitle>
                          <h5>Disbursement</h5>
                        </CardTitle>
                        <Row>
                          <TwoColumn
                            first="Status :"
                            second={
                              <Pill
                                color={
                                  data.disbursement_date
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {data.disbursement_date
                                  ? "Disbursed"
                                  : "Undisbursed"}
                              </Pill>
                            }
                          />
                        </Row>
                        {data.disbursement_date &&
                          data.transaction_merchant_disbursement?.length >
                            0 && (
                            <>
                              <Row>
                                <TwoColumn
                                  first="Destination Bank :"
                                  second={data.transaction_merchant_disbursement[0]?.settled_bank?.toUpperCase()}
                                />
                              </Row>
                              <Row>
                                <TwoColumn
                                  first="Destination Account :"
                                  second={
                                    data.transaction_merchant_disbursement[0]
                                      ?.settled_account_no
                                  }
                                />
                              </Row>
                              <Row>
                                <TwoColumn
                                  first="Destination Account Name :"
                                  second={
                                    data.transaction_merchant_disbursement[0]
                                      ?.settled_account_name
                                  }
                                />
                              </Row>
                              <Row>
                                <TwoColumn
                                  first="Transfer Code :"
                                  second={
                                    data.transaction_merchant_disbursement[0]
                                      ?.settled_code
                                  }
                                />
                              </Row>
                              <Row>
                                <TwoColumn
                                  first="Disbursed at :"
                                  second={dateTimeFormatter(
                                    data.disbursement_date
                                  )}
                                />
                              </Row>
                            </>
                          )}
                      </CardBody>
                    </Card>
                  </Row>
                )}
              </Column>
            </Row>
          </>,
        ]}
      />
    </>
  );
}

export default Component;
