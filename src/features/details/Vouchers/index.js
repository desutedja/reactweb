import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Button from "../../../components/Button";
import { FiCheck } from "react-icons/fi";
import Detail from "../components/Detail";
import Template from "../components/Template";
import Modal from "../../../components/Modal";
import { useHistory, useParams } from "react-router-dom";
import { get } from "../../slice";
import { endpointAdmin } from "../../../settings";
import { setSelected, deleteMerchant } from "../../slices/merchant";
import { toMoney, toSentenceCase } from "../../../utils";
import Table from "../../../components/Table";

const columnsCategories = [
  { Header: "ID", accessor: (row) => row.category_id },
  { Header: "Category Name", accessor: "category_name" },
  {
    Header: "Limit",
    accessor: "limit",
  },
];
const columnsCodes = [
  { Header: "ID", accessor: (row) => row.id },
  { Header: "Voucher Code", accessor: "voucher_code" },
  {
    Header: "Usage",
    accessor: (row) => {
      const sum = row.categories.reduce((a, b) => a + (b.usage || 0), 0);
      // row.categories;
      return sum;
    },
  },
  {
    Header: "Limit",
    accessor: (row) => {
      const sum = row.categories.reduce((a, b) => a + (b.limit || 0), 0);
      // row.categories;
      return sum;
    },
  },
  {
    Header: "Distributed",
    accessor: (row) => {
      return row.distributed === "y" ? "Yes" : "No";
    },
  },
  {
    Header: "Distribute",
    accessor: (row) => {
      return (
        <Button
          disabled={row.distributed === "y" ? true : false}
          icon={<FiCheck />}
          label="Distribute Check"
        />
      );
    },
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

const voucherCodes = {
  Information: ["copic_name", "pic_phone", "pic_mail"],
};

function Component({ view }) {
  const [data, setData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categories, setCategories] = useState([]);
  const [codes, setCodes] = useState([]);

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
          const check = newCats.filter((i) => i.id === el.category_id);
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
  }, [id, dispatch]);

  useEffect(() => {}, [codes]);

  return (
    <>
      <Modal
        isOpen={confirmDelete}
        btnDanger
        disableHeader={true}
        onClick={() => dispatch(deleteMerchant(data, history))}
        toggle={() => setConfirmDelete(false)}
        okLabel={"Delete"}
        cancelLabel={"Cancel"}
      >
        Are you sure you want to delete merchant <b>{data.name}</b>?
      </Modal>
      <Template
        // image={data.logo || "placeholder"}
        title={data.name}
        phone={data.phone}
        loading={!data.id}
        labels={["Details", "Voucher Codes"]}
        contents={[
          <>
            <Detail
              view={view}
              data={data}
              labels={info}
              editable={false}
              // onDelete={() => setConfirmDelete(true)}
            />
            {categories.length > 0 && (
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
                  Category
                </div>
                <Table
                  expander={false}
                  noSearch={true}
                  pagination={false}
                  columns={columnsCategories}
                  data={categories}
                />
              </>
            )}
          </>,
          <>
            {codes.length > 0 && (
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
            )}
          </>,
          // <Detail view={view} data={data} labels={voucherCodes} />,
        ]}
      ></Template>
    </>
  );
}

export default Component;
