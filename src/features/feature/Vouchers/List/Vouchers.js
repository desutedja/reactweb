import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiSearch } from "react-icons/fi";

import Button from "../../../../components/Button";
import Filter from "../../../../components/Filter";
import Input from "../../../../components/Input";
import { dateTimeFormatterCell, toMoney, toSentenceCase } from "../../../../utils";
import { endpointAdmin } from "../../../../settings";
import { get } from "../../../slice";

import Template from "../../../list/components/Template";
import { getVoucherV2, setSelected } from "../../../slices/vouchers";
import Voucher from "../../../../components/cells/Voucher";

const types = [
  { label: "Publik", value: "public" },
  { label: "Khusus", value: "special" },
];

const categoris = [
  { label: "Billing", value: "billing" },
  { label: "Merchant", value: "merchant" },
];

const targets = [
  { label: "Basic", value: "basic" },
  { label: "Premium", value: "premium" },
];

const stats = [
  { label: "Draft", value: "draft" },
  { label: "On Going", value: "ongoing" },
  { label: "Expired", value: "expired" },
];

const ListDataBuilding = ({ data }) => {
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      <div
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {toSentenceCase(data.category) + " - " + toSentenceCase(data.type)}
      </div>
      <div
        className={"list-modal-hover" + (modalHover ? " on" : "")}
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {data.target_buildings.map((item, i) => (
          <div className="p-3">{i + 1 + ". " + item.building_name}</div>
        ))}
      </div>
    </div>
  );
};

const ListDataMerchant = ({ data }) => {
  const [modalHover, setModalHover] = useState(false);
  return (
    <div className="modal-hover">
      <div
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {toSentenceCase(data.category) + " - " + toSentenceCase(data.type)}
      </div>
      <div
        className={"list-modal-hover" + (modalHover ? " on" : "")}
        onMouseEnter={() => setModalHover(true)}
        onMouseLeave={() => setModalHover(false)}
      >
        {data.target_merchants.map((item, i) => (
          <div className="p-3">{i + 1 + ". " + item.merchant_name}</div>
        ))}
      </div>
    </div>
  );
};

const columns = [
  {
    Header: "Campaign Name / Promo Code",
    accessor: (row) => (
      <Voucher
        id={row.id}
        data={row}
        items={[
          <b>{row.voucher_name}</b>,
          <p>
            Discount :{" "}
            {row.discount_type === "percentage"
              ? `${row.discount}%`
              : toMoney(row.discount)}
          </p>,
          // <p>{toSentenceCase(row.type)}</p>
        ]}
      />
    ),
  },
  {
    Header: "Category & Type",
    accessor: (row) =>
      row.target_buildings.length > 0 ? (
        <ListDataBuilding data={row} />
      ) : row.target_merchants.length > 0 ? (
        <ListDataMerchant data={row} />
      ) : (
        toSentenceCase(row.category) + " - " + toSentenceCase(row.type)
      ),
  },
  {
    Header: "Total Voucher",
    accessor: (row) => {
      return (
        <div>
          <b>{row.total_voucher}</b>
        </div>
      );
    },
  },
  {
    Header: "Total Usage",
    accessor: (row) => {
      return (
        <div>
          <b>{row.max_voucher_peruser}</b>
        </div>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) => {
      return (
        <div>
          <b>{toSentenceCase(row.status)}</b>
        </div>
      );
    },
  },
  {
    Header: "Start Date",
    accessor: (row) =>
      row.expired_date ? dateTimeFormatterCell(row.start_date) : "-",
  },
  {
    Header: "Expired Date",
    accessor: (row) =>
      row.expired_date ? dateTimeFormatterCell(row.expired_date) : "-",
  },
];

function Component({ view }) {
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");

  const [target, setTarget] = useState("");
  const [targetName, setTargetName] = useState("");

  const [stat, setStat] = useState("");
  const [statName, setStatName] = useState("");

  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    if (search.length === 0) {
      setLimit(5);
    }
  }, [search]);

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

  return (
    <Template
      view={view}
      pagetitle="Voucher List"
      columns={columns}
      slice="vouchers"
      getAction={getVoucherV2}
      //   deleteAction={deleteMerchant}
      filterVars={[type, cat, target, building, stat]}
      filters={[
        {
          hidex: building === "",
          label: (
            <p>Building: {building ? <b>{buildingName}</b> : <b>All</b>}</p>
          ),
          delete: () => setBuilding(""),
          component: (toggleModal) => (
            <>
              <Input
                label="Search Building"
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
        {
          hidex: type === "",
          label: <p>Type: {type ? <b>{typeLabel}</b> : <b>All</b>}</p>,
          delete: () => {
            setType("");
          },
          component: (toggleModal) => (
            <Filter
              data={types}
              onClickAll={() => {
                setType("");
                setTypeLabel("");
                toggleModal(false);
              }}
              onClick={(el) => {
                setType(el.value);
                setTypeLabel(el.label);
                toggleModal(false);
              }}
            />
          ),
        },
        {
          button: (
            <Button
              key="Category: All"
              label={cat ? catName : "Category: All"}
              selected={cat}
            />
          ),
          hidex: cat === "",
          label: <p>Category: {cat ? <b>{catName}</b> : <b>All</b>}</p>,
          delete: () => {
            setCat("");
          },
          component: (toggleModal) => (
            <Filter
              data={categoris}
              onClickAll={() => {
                setCat("");
                setCatName("");
                toggleModal(false);
              }}
              onClick={(el) => {
                setCat(el.value);
                setCatName(el.label);
                toggleModal(false);
              }}
            />
          ),
        },
        {
          button: (
            <Button
              key="Target User: All"
              label={target ? targetName : "Target User: All"}
              selected={target}
            />
          ),
          hidex: target === "",
          label: (
            <p>Target User: {target ? <b>{targetName}</b> : <b>All</b>}</p>
          ),
          delete: () => {
            setTarget("");
          },
          component: (toggleModal) => (
            <Filter
              data={targets}
              onClickAll={() => {
                setTarget("");
                setTargetName("");
                toggleModal(false);
              }}
              onClick={(el) => {
                setTarget(el.value);
                setTargetName(el.label);
                toggleModal(false);
              }}
            />
          ),
        },
        {
          button: (
            <Button
              key="Status: All"
              label={stat ? statName : "Status: All"}
              selected={stat}
            />
          ),
          hidex: stat === "",
          label: <p>Status: {stat ? <b>{statName}</b> : <b>All</b>}</p>,
          delete: () => {
            setStat("");
          },
          component: (toggleModal) => (
            <Filter
              data={stats}
              onClickAll={() => {
                setStat("");
                setStatName("");
                toggleModal(false);
              }}
              onClick={(el) => {
                setStat(el.value);
                setStatName(el.label);
                toggleModal(false);
              }}
            />
          ),
        },
      ]}
      actions={
        view
          ? null
          : [
              <Button
                key="Add Voucher"
                label="Add Voucher"
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
