import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/Button";
import { FiCheck } from "react-icons/fi";
import Detail from "../components/Detail";
import Template from "../components/Template";
import Modal from "../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../slice";
import { endpointAdmin } from "../../../settings";
import { toMoney, toSentenceCase } from "../../../utils";
import Table from "../../../components/Table";
import { distributeVoucher, setSelected } from "../../slices/vouchers";

const columnsCategories = [
  { Header: "ID", accessor: (row) => row.category_id },
  { Header: "Category Name", accessor: "category_name" },
  {
    Header: "Limit",
    accessor: "limit",
  },
];
const info = {
  Information: [
    "id",
    {
      label: "prefix",
      lfmt: (v) => "Campaign Name ",
      vfmt: (v) => {
        return v;
      },
    },
    {
      label: "name",
      lfmt: (v) => "Specific Merchant ",
      vfmt: (v) => {
        return v;
      },
    },
    {
      label: "discount_type",
      lfmt: (v) => "Discount Type",
      vfmt: (v) => {
        return toSentenceCase(v);
      },
    },
    {
      label: "discount",
      lfmt: (v) => "Discount",
      vfmt: (v) => {
        if (v < 100) {
          return `${v} %`;
        }
        return toMoney(v);
      },
    },
    {
      label: "minimum_transaction",
      lfmt: (v) => "Minimum Transaction",
      vfmt: (v) => {
        return (v);
      },
    },
    {
      label: "maximum_discount",
      lfmt: (v) => "Maximum Discount",
      vfmt: (v) => {
        return (v);
      },
    },
    {
      label: "building_name",
      lfmt: (v) => "Target Building",
      vfmt: (v) => {
        return toSentenceCase(v);
      },
    },
    "total_voucher_codes",
    "total_distributed",
  ],
};


function Component({ view, canUpdate }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDistribute, setConfirmDistribute] = useState(false);
  const [voucherCodeId, setVoucherCodeId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [codes, setCodes] = useState([]);
  const { loading, refreshToggle } = useSelector((state) => state.vouchers);

  let dispatch = useDispatch();
  let history = useHistory();
  let { id } = useParams();

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/centratama/vouchers/" + id, (res) => {
        // res.data.data.free_deliv = res.data.data.free_deliv.toString();
        setData(res.data.data);
        dispatch(setSelected(res.data.data));
        const cats = res.data.data.categories;
        const newCats = [];
        for (var i = 0; i < cats.length; i++) {
          const el = cats[i];
          const check = newCats.filter((x) => x.category_id === el.category_id);
          if (check.length > 0) {
            break;
          }
          newCats.push(el);
        }
        setCategories(newCats);

        const cods = res.data.data.codes;
        const newCods = [];
        cods.map((el) => {
          const item = { ...el, categories: [] };
          const catego = cats.filter((i) => i.voucher_code_id === el.id);
          item.categories = catego;
          newCods.push(item);
        });
        setCodes(newCods);
      })
    );
  }, [dispatch, refreshToggle]);

  useEffect(() => {
    console.log(codes);
  }, [codes]);

  return (
    <>
      <Modal
        isOpen={confirmDistribute}
        btnDanger
        disableHeader={true}
        onClick={() => {
          dispatch(distributeVoucher(voucherCodeId, id, history));
          setConfirmDistribute(false);
        }}
        toggle={() => setConfirmDistribute(false)}
        okLabel={"Distribute"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to distribute this voucher code?
      </Modal>
      <Template
        // image={data.logo || "placeholder"}
        title={data.name}
        phone={data.phone}
        loading={!data.id}
        labels={["Details"]}
        contents={[
          <>
            <Detail
              view={view}
              data={data}
              labels={info}
              editable={canUpdate}
              // onDelete={() => setConfirmDelete(true)}
            />
          </>,
          // <Detail view={view} data={data} labels={voucherCodes} />,
        ]}
      ></Template>
    </>
  );
}

export default Component;

// building_management_id	2
// building_management_id_label	"Centratama Group by Fastel Sarana Indonesia"
// categories	[…]
// 0	{…}
// category_id	1
// limit	1
// discount	10
// discount_type	"percentage"
// discount_type_label	"Percentage"
// expired_date	"2021-11-30 23:59:59"
// limit	1
// maximum_discount	"10000"
// merchant_id	63
// merchant_id_label	"ACS Gourmet – Tebet"
// minimum_transaction	"100000"
// prefix	"TEST1234"
// usage_limit	1