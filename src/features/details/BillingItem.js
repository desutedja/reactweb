/* eslint-disable eqeqeq */
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Detail from "./components/Detail";
import Template from "./components/Template";

import Modal from "../../components/Modal";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { payByCash, setSelectedItem } from "../slices/billing";
import { Formik, Form } from "formik";
import Input from "../form/input";
import Pill from "../../components/Pill";
import SubmitButton from "../form/components/SubmitButton";
import { post, get, setConfirmDelete } from "../slice";
import { endpointBilling } from "../../settings";
import {
  toMoney,
  dateFormatter,
  dateTimeFormatter,
  toSentenceCase,
} from "../../utils";
import { FiPlus } from "react-icons/fi";

const columns = [
  { Header: "ID", accessor: "id" },
  {
    Header: "Created On",
    accessor: (row) => dateTimeFormatter(row.created_on),
  },
  { Header: "Charge Name", accessor: "charge_name" },
  { Header: "Charge Description", accessor: "charge_description" },
  { Header: "Charge Price", accessor: (row) => toMoney(row.charge_price) },
];

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Component({ view, canUpdate, canAdd, canDelete }) {
  console.log(canUpdate);
  const [modal, setModal] = useState(false);
  const [modalCash, setModalCash] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [dataDetails, setDataDetails] = useState({});
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState("");
  const [pageCount, setPageCount] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const { refreshToggle } = useSelector((state) => state.billing);
  const { role } = useSelector((state) => state.auth);

  let dispatch = useDispatch();

  const { unitid, id } = useParams();

  const details = useMemo(
    () => ({
      Information: [
        "created_on",
        {
          label: "month",
          vfmt: (v) => (
            <>
              {months[v]} {dataDetails.year}
            </>
          ),
        },
        { label: "group", vfmt: (v) => (v === "ipl" ? "IPL" : "Non-IPL") },
        { label: "name", lfmt: () => "Billing Name", vfmt: (v) => v },
        "service_name",
        { label: "remarks", lfmt: () => "Billing Description", vfmt: (v) => v },
      ],
      "Payment Information": [
        { label: "due_date", vfmt: (v) => dateFormatter(v) },
        {
          label: "payment",
          vfmt: (v) => (
            <Pill color={v === "paid" ? "success" : "secondary"}>
              {toSentenceCase(v)}
            </Pill>
          ),
        },
        {
          disabled: dataDetails.payment == "unpaid",
          label: "payment_date",
          vfmt: (v) => dateTimeFormatter(v),
        },
        {
          disabled: dataDetails.payment == "unpaid",
          label: "ref_code",
          vfmt: (v) =>
            v ? (
              <a
                className="Link"
                href={"/" + role + "/billing/unit/" + unitid + "/record/" + v}
              >
                {v}
              </a>
            ) : (
              "-"
            ),
        },
      ],
      "Payment Calculation": [
        {
          disabled: !dataDetails.denom_unit,
          label: "previous_usage",
          vfmt: (v) => (
            <>
              {v} {dataDetails.denom_unit}
            </>
          ),
        },
        {
          disabled: !dataDetails.denom_unit,
          label: "recent_usage",
          vfmt: (v) => (
            <>
              {v} {dataDetails.denom_unit}
            </>
          ),
        },
        {
          disabled: !dataDetails.denom_unit,
          label: "",
          lfmt: () => "Usage",
          vfmt: (v) => (
            <>
              {dataDetails.recent_usage - dataDetails.previous_usage}{" "}
              {dataDetails.denom_unit}
            </>
          ),
        },
        {
          label: "price_unit",
          vfmt: (v) => (
            <>
              {toMoney(v)}
              {dataDetails.denom_unit
                ? "/" + dataDetails.denom_unit
                : " (fixed)"}
            </>
          ),
        },
        { label: "subtotal", vfmt: (v) => toMoney(v) },
        {
          label: "tax",
          vfmt: (v) => (
            <>
              {toMoney(dataDetails.tax_amount)} (
              {v === "percentage" ? dataDetails.tax_value + "%" : "fixed"})
            </>
          ),
        },
        //{label: 'tax_amount', vfmt: v => v ? toMoney(v) : '-'},
        //{label: 'tax_value',  vfmt: v => v ? toMoney(v) : '-'},
        {
          label: "total",
          lfmt: () => "Subtotal After Tax",
          vfmt: (v) => toMoney(v),
        },
        { label: "additional_charge_amount", vfmt: (v) => toMoney(v) },
        {
          label: "billing_penalty_amount",
          lfmt: () =>
            dataDetails.payment === "paid" ? "Paid Due Penalty" : "Due Penalty",
          vfmt: (v) => (
            <>
              {toMoney(v)} (
              {dataDetails.payment === "paid"
                ? dataDetails.billing_record_penalty
                : dataDetails.penalty_fee}
              %)
            </>
          ),
        },
        { label: "total_amount", vfmt: (v) => toMoney(v) },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [dataDetails]
  );

  useEffect(() => {
    !dataDetails && setLoadingDetails(true);
    dispatch(
      get(endpointBilling + "/management/billing/detail/" + id, (res) => {
        setDataDetails(res.data.data);
        dispatch(setSelectedItem(res.data.data));
        setLoadingDetails(false);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, toggle, refreshToggle]);

  useEffect(() => {
    setLoading(true);
    dispatch(
      get(
        endpointBilling + "/management/billing/additional-charge?id=" + id,
        (res) => {
          setData(res.data.data);
          setTotalItems(res.data.data.length);
          setPageCount(1);
          setLoading(false);
        }
      )
    );
  }, [dispatch, id, toggle]);

  const cashModalUp = useCallback(() => {
    setModalCash(true);
  }, []);

  return (
    <>
      <Modal
        title="Set as paid by cash"
        isOpen={modalCash}
        onClick={() => {
          dispatch(
            payByCash({
              id: parseInt(id),
              total: dataDetails.total,
              penalty_fee: dataDetails.penalty_fee,
              penalty_amount: dataDetails.billing_penalty_amount,
              total_payment: dataDetails.total_amount,
              additional_charge_amount: dataDetails.additional_charge_amount,
            })
          );
          setModalCash(false);
        }}
        toggle={() => setModalCash(false)}
        okLabel="Confirm"
      >
        <ul>
          <li>Subtotal : {toMoney(dataDetails.total)}</li>
          <li>Tax : {toMoney(dataDetails.tax_amount)}</li>
          <li>
            Additional Charges : {toMoney(dataDetails.additional_charge_amount)}
          </li>
          <li>Due Penalty : {toMoney(dataDetails.billing_penalty_amount)}</li>
          <li>
            <b>Total Amount : {toMoney(dataDetails.total_amount)}</b>
          </li>
        </ul>
        Are you sure you want to set <b>{dataDetails.name}</b> as paid by cash?
      </Modal>
      <Modal
        disableFooter
        isOpen={modal}
        toggle={() => setModal(false)}
        title="Add Additional Charge"
      >
        <Formik
          initialValues={{
            charge_name: "",
            charge_description: "",
            charge_price: "",
          }}
          onSubmit={(values) => {
            const data = {
              ...values,
              billing_id: parseInt(id),
              charge_price: parseInt(values.charge_price, 10),
            };

            console.log(data);

            dispatch(
              post(
                endpointBilling + "/management/billing/additional-charge",
                data,
                (res) => {
                  setModal(false);
                  setToggle(!toggle);
                }
              )
            );
          }}
        >
          {(props) => {
            const { errors } = props;

            return (
              <Form className="Form">
                <Input {...props} label="Charge Name" />
                <Input {...props} label="Charge Description" />
                <Input {...props} label="Charge Price" />
                <SubmitButton errors={errors} />
              </Form>
            );
          }}
        </Formik>
      </Modal>
      <Template
        pagetitle="Billing Details"
        title={id}
        loading={loadingDetails}
        labels={["Details", "Additional Charges"]}
        contents={[
          <Detail
            view={view}
            type="Billing"
            data={dataDetails}
            labels={details}
            editable={
              dataDetails.payment !== "paid" &&
              (role === "bm" ? canUpdate : true)
            }
            renderButtons={() => [
              dataDetails.payment !== "paid" && (
                <Button label="Set as Paid" onClick={() => cashModalUp()} />
              ),
            ]}
          />,
          <Table
            columns={columns}
            loading={loading}
            totalItems={totalItems}
            pageCount={pageCount}
            data={data}
            actions={
              view
                ? null
                : [
                    dataDetails.payment !== "paid" &&
                    (role === "bm" ? !canUpdate && !canAdd : true) ? null : (
                      <Button
                        icon={<FiPlus />}
                        label="Add Additional Charge"
                        onClick={() => setModal(true)}
                      />
                    ),
                  ]
            }
            onClickDelete={
              view
                ? null
                : role === "bm" && !canDelete
                ? null
                : (row) => {
                    dispatch(
                      setConfirmDelete(
                        "Are you sure to delete this item?",
                        () => {
                          dispatch(
                            post(
                              endpointBilling +
                                "/management/billing/additional-charge/delete",
                              {
                                delete: [row.id],
                              },
                              (res) => {
                                setToggle(!toggle);
                              }
                            )
                          );
                        }
                      )
                    );
                  }
            }
          />,
        ]}
      />
    </>
  );
}

export default Component;
