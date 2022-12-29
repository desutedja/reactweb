import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/Button";
import { FiCheck } from "react-icons/fi";
import Detail from "../../../details/components/Detail";
import Template from "../../../details/components/Template";
import Modal from "../../../../components/Modal";
import Pill from "../../../../components/Pill";
import PillBilling from "../../../../components/PillBilling";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../../slice";
import { endpointAdmin } from "../../../../settings";
import { dateTimeFormatter, toMoney, toSentenceCase } from "../../../../utils";
import Table from "../../../../components/Table";
import {
  distributeVoucher,
  refresh,
  setSelected,
} from "../../../slices/vouchers";
import parser from "html-react-parser";

function Component({ view }) {
  const [data, setData] = useState({});
  const [confirmDistribute, setConfirmDistribute] = useState(false);
  const [voucherCodeId, setVoucherCodeId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [codes, setCodes] = useState([]);
  const { loading, refreshToggle } = useSelector((state) => state.vouchers);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();
  // const columnsCodes = [
  //   { Header: "ID", accessor: (row) => row.id },
  //   { Header: "Voucher Code", accessor: "voucher_code" },
  //   {
  //     Header: "Usage",
  //     accessor: (row) => {
  //       const sum = row.categories.reduce((a, b) => a + (b.usage || 0), 0);
  //       // row.categories;
  //       return sum;
  //     },
  //   },
  //   {
  //     Header: "Limit",
  //     accessor: (row) => {
  //       const sum = row.categories.reduce((a, b) => a + (b.limit || 0), 0);
  //       // row.categories;
  //       return sum;
  //     },
  //   },
  //   {
  //     Header: "Distributed",
  //     accessor: (row) => {
  //       return row.distributed === "y" ? "Yes" : "No";
  //     },
  //   },
  //   {
  //     Header: "Distribute",
  //     accessor: (row) => {
  //       return (
  //         <Button
  //           disabled={row.distributed === "y" ? true : false}
  //           icon={<FiCheck />}
  //           label="Distribute Voucher"
  //           onClick={() => {
  //             setVoucherCodeId(row.id);
  //             setConfirmDistribute(true);
  //           }}
  //         />
  //       );
  //     },
  //   },
  // ];

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/centratama/v2/vouchers/" + id, (res) => {
        // res.data.data.free_deliv = res.data.data.free_deliv.toString();
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        // const cats = res.data.data.categories;
        // const newCats = [];
        // for (var i = 0; i < cats.length; i++) {
        //   const el = cats[i];
        //   const check = newCats.filter((x) => x.category_id === el.category_id);
        //   if (check.length > 0) {
        //     break;
        //   }
        //   newCats.push(el);
        // }
        // setCategories(newCats);

        // const cods = res.data.data.codes;
        // const newCods = [];
        // cods.map((el) => {
        //   const item = { ...el, categories: [] };
        //   const catego = cats.filter((i) => i.voucher_code_id === el.id);
        //   item.categories = catego;
        //   newCods.push(item);
        // });
        // setCodes(newCods);
      })
    );
  }, [dispatch, refreshToggle]);

  useEffect(() => {
    console.log(codes);
  }, [codes]);

  const info = {
    "Voucher Information": [
      "id",
      {
        label: "category",
        lfmt: (v) => "Category Voucher ",
        vfmt: (v) => {
          return toSentenceCase(v);
        },
      },
      {
        label: "type",
        lfmt: (v) => "Target Voucher ",
        vfmt: (v) => {
          return toSentenceCase(v);
        },
      },
      {
        label: "voucher_name",
        lfmt: (v) => "Voucher Name ",
        vfmt: (v) => {
          return toSentenceCase(v);
        },
      },
      {
        label: "voucher_code",
        disabled: data.type !== "special",
        lfmt: (v) => "Voucher Code ",
        vfmt: (v) => {
          return (
            <>
              <PillBilling color="info" borderRadius={4} padding="10px">
                {toSentenceCase(v)}
              </PillBilling>
            </>
          );
        },
      },
      {
        label: "target_buildings",
        lfmt: (v) => "Target Building ",
        vfmt: (v) =>
          v && v.length > 0
            ? v.map((el) => <Pill color="primary">{el.building_name}</Pill>)
            : " - ",
      },
      {
        label: "target_merchants",
        lfmt: (v) => "Target Merchant ",
        vfmt: (v) =>
          v && v.length > 0
            ? v.map((el) => <Pill color="primary">{el.merchant_name}</Pill>)
            : " - ",
      },
    ],
    "Voucher Settings": [
      {
        label: "discount_type",
        lfmt: (v) => "Discount Type ",
        vfmt: (v) => {
          return toSentenceCase(v);
        },
      },
      {
        label: "discount",
        disabled: data.discount_type === "fee",
        lfmt: (v) => "Nominal Discount ",
        vfmt: (v) => {
          return v + "%";
        },
      },
      {
        label: "discount",
        disabled: data.discount_type === "percentage",
        lfmt: (v) => "Nominal Discount ",
        vfmt: (v) => {
          return toMoney(v);
        },
      },
      {
        label: "maximum_discount",
        disabled: data.discount_type === "fee",
        lfmt: (v) => "Maximum Discount ",
        vfmt: (v) => {
          return v === 0 ? " - " : toMoney(v);
        },
      },
      {
        label: "minimum_transaction",
        lfmt: (v) => "Minimum Transaction ",
        vfmt: (v) => {
          return toMoney(v);
        },
      },
      {
        label: "total_voucher",
        lfmt: (v) => "Total Voucher ",
        vfmt: (v) => {
          return v;
        },
      },
      {
        label: "max_voucher_peruser",
        lfmt: (v) => "Total Usage ",
        vfmt: (v) => {
          return v;
        },
      },
      {
        label: "start_date",
        lfmt: (v) => "Start Date ",
        vfmt: (v) => {
          return dateTimeFormatter(v);
        },
      },
      {
        label: "expired_date",
        lfmt: (v) => "Expired Date ",
        vfmt: (v) => {
          return dateTimeFormatter(v);
        },
      },
      {
        label: "remark",
        lfmt: (v) => "Srayat & Ketentuan ",
        vfmt: (v) => {
          return parser(v);
        },
      },
    ],
  };

  return (
    <>
      {/* <Modal
        isOpen={confirmDistribute}
        btnDanger
        disableHeader={true}
        onClick={() => {
          dispatch(distributeVoucher(voucherCodeId, id, history));
          setConfirmDistribute(false);
          dispatch(refresh());
        }}
        toggle={() => setConfirmDistribute(false)}
        okLabel={"Distribute"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to distribute this voucher code?
      </Modal> */}
      <Template
        // image={data.logo || "placeholder"}
        title={data.name}
        pagetitle="Voucher Information"
        phone={data.phone}
        loading={!data.id}
        labels={["Details", "Voucher Usage"]}
        contents={[
          <>
            <Detail view={view} data={data} labels={info} editable={false} />
          </>,
          <>
            {/* {codes.length > 0 && (
              <>
                <div
                  style={{
                    color: "grey",
                    borderBottom: "1px solid silver",
                    width: 200,
                    marginBottom: 8,
                    marginLeft: 4,
                  }}
                >
                  Voucher Codes
                </div>
                <Table
                  expander={false}
                  noSearch={true}
                  pagination={false}
                  columns={columnsCodes}
                  data={codes}
                />
              </>
            )} */}
          </>,
        ]}
      ></Template>
    </>
  );
}

export default Component;
