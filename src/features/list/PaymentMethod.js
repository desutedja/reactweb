import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
// import { getMerchant, setSelected, deleteMerchant } from "../slices/merchant";
import { dateTimeFormatterCell, toMoney } from "../../utils";
import { endpointAdmin } from "../../settings";
import { get } from "../slice";

import Template from "./components/Template";
import { getVoucher, setSelected } from "../slices/vouchers";
import PaymentMethod from "../../components/cells/PaymentMethod";

const columns = [
  {
    Header: "Bank",
    accessor: (row) => (
      <PaymentMethod
        id={row.id}
        data={row}
        items={[
          <p>
            Bank
          </p>,
        ]}
      />
    ),
  },
  {
    Header: "Target Building",
    accessor: (row) =>
      row.building_name && row.management_name
        ? row.building_name + " by " + row.management_name
        : "-",
  },
  {
    Header: "Fee/Percentage/Markup",
    accessor: (row) => {
      return (
        <div>
          <div>
            Fee : <b>Rp 1000 + 2%</b>
          </div>
          <div>
            Markup : <b>None</b>
          </div>
        </div>
      );
    },
  },
  {
    Header: "Start Date",
    accessor: (row) => 
      row.expired_date ? dateTimeFormatterCell(row.expired_date) : "-",
  },
  {
    Header: "End Date",
    accessor: (row) =>
      row.expired_date ? dateTimeFormatterCell(row.expired_date) : "-",
  },
  {
    Header: "Created On",
    accessor: (row) =>{
      return (
        <div>
          <div>
            {
      row.expired_date ? dateTimeFormatterCell(row.expired_date) : "-"}
          </div>
          <div>
            by System
          </div>
        </div>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) =>
      "-",
  },
];

function Component({ view }) {
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");
  const [cats, setCats] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/centratama/vouchers/list?name=" + search, (res) => {
        let data = res.data.data;
        let formatted = data.map((el) => ({ label: el.name, value: el.name }));
        let limited = formatted.slice(0, limit);

        const restTotal = formatted.length - limited.length;
        const valueLimit = 5;

        if (limited.length < formatted.length) {
          limited.push({
            label:
              "load " +
              (restTotal > valueLimit ? valueLimit : restTotal) +
              " more",
            className: "load-more",
            restTotal: restTotal > valueLimit ? valueLimit : restTotal,
          });
        }

        setCats(limited);
      })
    );
  }, [dispatch, limit, search]);

  useEffect(() => {
    if (search.length === 0) {
      setLimit(5);
    }
  }, [search]);

  return (
    <Template
      view={view}
      columns={columns}
      slice="vouchers"
      getAction={getVoucher}
      //   deleteAction={deleteMerchant}
      filterVars={[type, cat]}
      //   filters={[
      //     {
      //       hidex: type === "",
      //       label: <p>{type ? "Type: " + typeLabel : "Type: All"}</p>,
      //       delete: () => {
      //         setType("");
      //       },
      //       component: (toggleModal) => (
      //         <Filter
      //           data={merchant_types}
      //           onClickAll={() => {
      //             setType("");
      //             setTypeLabel("");
      //             toggleModal(false);
      //           }}
      //           onClick={(el) => {
      //             setType(el.value);
      //             setTypeLabel(el.label);
      //             toggleModal(false);
      //           }}
      //         />
      //       ),
      //     },
      //     {
      //       button: (
      //         <Button
      //           key="Category: All"
      //           label={cat ? catName : "Category: All"}
      //           selected={cat}
      //         />
      //       ),
      //       hidex: cat === "",
      //       label: <p>{cat ? "Category: " + catName : "Category: All"}</p>,
      //       delete: () => {
      //         setCat("");
      //       },
      //       component: (toggleModal) => (
      //         <>
      //           <Input
      //             label="Search"
      //             compact
      //             icon={<FiSearch />}
      //             inputValue={search}
      //             setInputValue={setSearch}
      //           />
      //           <Filter
      //             data={cats}
      //             onClick={(el) => {
      //               if (!el.value) {
      //                 setLimit(limit + el.restTotal);
      //                 return;
      //               }
      //               setCat(el.value);
      //               setCatName(el.label);
      //               setLimit(5);
      //               toggleModal(false);
      //               setSearch("");
      //             }}
      //             onClickAll={() => {
      //               setCat("");
      //               setCatName("");
      //               setLimit(5);
      //               toggleModal(false);
      //               setSearch("");
      //             }}
      //           />
      //         </>
      //       ),
      //     },
      //   ]}
      actions={
        view
          ? null
          : [
              <Button
                key="Add Voucher"
                label="Add VA"
                icon={<FiPlus />}
                onClick={() => {
                  dispatch(setSelected({}));
                  history.push(url + "/add");
                }}
              />,
            ]
      }
    />
  );
}

export default Component;
