import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormatterCell, toMoney, toSentenceCase } from "../../../../utils";
import { endpointAdmin } from "../../../../settings";
import { get, setConfirmDelete } from "../../../slice";

import TablePromoVA from "../../../../components/TablePromoVA";
import Breadcrumb from "../../../../components/Breadcrumb";
import Pill from "../../../../components/Pill";
import { setSelected } from "../../../slices/vouchers";
import { FiPlus, FiSearch } from "react-icons/fi";

import Button from "../../../../components/Button";
import Filter from "../../../../components/Filter";
import PromoVA from "../../../../components/cells/PromoVA";
import { deleteVA, editVA } from "../../../slices/promova";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import MultiSelectInput from "../../../form/input/MultiSelect";

const columns = [
  // { Header: "ID", accessor: "id" },
  {
    Header: "Bank",
    accessor: (row) => <b>{toSentenceCase(row.provider)}</b>,
  },
  {
    Header: "Target Building",
    accessor: (row) => row.name,
  },
  {
    Header: "Fee/Percentage/Markup",
    accessor: (row) => {
      return (
        <div>
          <div>
            {row.fee_type === "percentage"
              ? toSentenceCase(row.fee_type) + " : " + row.percentage + "%"
              : row.fee_type === "fee"
              ? toSentenceCase(row.fee_type) + " : " + toMoney(row.fee)
              : toSentenceCase(row.fee_type) +
                " : " +
                toMoney(
                  parseInt(row.fee) + parseInt(row.fee * (row.percentage / 100))
                )}
          </div>
        </div>
      );
    },
  },
  {
    Header: "Start Date",
    accessor: (row) =>
      row.start_date ? dateTimeFormatterCell(row.start_date) : "-",
  },
  {
    Header: "End Date",
    accessor: (row) =>
      row.end_date ? dateTimeFormatterCell(row.end_date) : "-",
  },
  {
    Header: "Created On",
    accessor: (row) => {
      return (
        <div>
          <div>
            {row.created_on ? dateTimeFormatterCell(row.created_on) : "-"}
          </div>
          <div>by System</div>
        </div>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) =>
      row.status === "scheduled" ? (
        <Pill color="secondary">{toSentenceCase(row.status)}</Pill>
      ) : row.status === "ongoing" ? (
        <Pill color="warning">{toSentenceCase(row.status)}</Pill>
      ) : (
        <Pill color="primary">{toSentenceCase(row.status)}</Pill>
      ),
  },
];

function Component({ view, title = "", pagetitle, canDelete }) {
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildings, setBuildings] = useState("");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [buildingLimit, setBuildingLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });
  const [status, setStatus] = useState("");
  const { role } = useSelector((state) => state.auth);
  const [bank, setBank] = useState("");
  const [bankName, setBankName] = useState("");
  const [dataBanks, setDataBanks] = useState([]);

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    (!buildingSearch || buildingSearch.length >= 1) &&
      dispatch(
        get(
          endpointAdmin +
            "/building" +
            "?limit=" +
            buildingLimit +
            "&page=1" +
            "&search=" +
            buildingSearch,
          (res) => {
            let data = res.data.data.items;
            let totalItems = Number(res.data.data.total_items);
            let restTotal = totalItems - data.length;

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            if (data.length < totalItems && buildingSearch.length === 0) {
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
  }, [dispatch, buildingSearch, buildingLimit]);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/paymentperbuilding/list/payment_method", (res) => {
        const banks = res.data.data.items.map((el) => ({
          value: el.id,
          label: toSentenceCase(el.provider),
        }));

        dispatch(setDataBanks(banks));
      })
    );
  }, [dispatch]);

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">Promo VA List</h2>
      <div className="Container">
        <TablePromoVA
          searchField={false}
          columns={columns}
          data={data?.items || []}
          // onSelection={(selectedRows) => {
          //   const selectedRowIds = [];
          //   selectedRows.map((row) => {
          //     if (row !== undefined){
          //       selectedRowIds.push(row.id);
          //       setMultiActionRows([...selectedRowIds]);
          //     }
          //   });
          // }}
          fetchData={useCallback(
            (page, limit, searchItem, sortField, sortType) => {
              setLoading(true);
              dispatch(
                get(
                  endpointAdmin +
                    "/paymentperbuilding/list?status=" +
                    status +
                    "&start_date=" +
                    startdate +
                    "&end_date=" +
                    enddate +
                    "&building_id=" +
                    building +
                    "&bank=" +
                    bank +
                    "&sort_field=created_on&sort_type=DESC" +
                    "&limit=" +
                    limit +
                    "&page=" +
                    (page + 1),

                  (res) => {
                    console.log(res.data.data);
                    setData(res.data.data);
                    setLoading(false);
                  }
                )
              );
              // eslint-disable-next-line react-hooks/exhaustive-deps
            },
            [dispatch, building, bank, status, startdate, enddate]
          )}
          loading={loading}
          onClickChange={
            view
              ? null
              : (row) => {
                  dispatch(setSelected(row));
                  history.push(url + "/edit");
                  console.log(row);
                }
          }
          onClickStop={
            view
              ? null
              : role === "bm" && !canDelete
              ? null
              : (row) => {
                  dispatch(
                    setConfirmDelete(
                      // "Are you sure to end this promo?",
                      "Feature still under development",
                      () => {
                        // dispatch(deleteVA(row));
                      }
                    )
                  );
                }
          }
          actions={
            view
              ? null
              : [
                  <Button
                    key="Add Promo VA"
                    label="Add Promo VA"
                    icon={<FiPlus />}
                    onClick={() => {
                      dispatch(setSelected({}));
                      history.push(url + "/add");
                    }}
                  />,
                ]
          }
          pageCount={data?.filtered_page}
          totalItems={data?.filtered_item}
          filters={[
            {
              hidex: bank === "",
              label: "Bank: ",
              value: bank ? toSentenceCase(bankName) : "All",
              delete: () => setBank(""),
              component: (toggleModal) => (
                <>
                  <Filter
                    data={dataBanks}
                    onClick={(el) => {
                      setBank(el.value);
                      setBankName(el.label);
                      toggleModal(false);
                    }}
                    onClickAll={() => {
                      setBank("");
                      setBankName("");
                      toggleModal(false);
                    }}
                  />
                </>
              ),
            },
            {
              hidex: building === "",
              label: "Building: ",
              value: building ? buildingName : "All",
              delete: () => {
                setBuilding("");
              },
              component: (toggleModal) => (
                <>
                  <Input
                    label="Search Building"
                    compact
                    icon={<FiSearch />}
                    inputValue={buildingSearch}
                    setInputValue={setBuildingSearch}
                  />
                  <Filter
                    data={buildings}
                    onClick={(el) => {
                      if (!el.value) {
                        setBuildingLimit(buildingLimit + el.restTotal);
                        return;
                      }
                      setBuilding(el.value);
                      setBuildingName(el.label);
                      setBuildingLimit(5);
                      toggleModal(false);
                    }}
                    onClickAll={() => {
                      setBuilding("");
                      setBuildingName("");
                      setBuildingLimit(5);
                      toggleModal(false);
                    }}
                  />
                </>
              ),
            },
            {
              hidex: status === "",
              label: "Status: ",
              value: status ? toSentenceCase(status) : "All",
              delete: () => setStatus(""),
              component: (toggleModal) => (
                <>
                  <Filter
                    data={[
                      { label: "Ongoing", value: "ongoing" },
                      { label: "Scheduled", value: "scheduled" },
                      { label: "Expired", value: "expired" },
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
          // actions={[
          //   <>
          //     {view ? null : role === "bm" && !canAdd ? null : (
          //       <Button
          //         key="Add Billing"
          //         label="Add Billing"
          //         icon={<FiPlus />}
          //         onClick={() => {
          //           dispatch(setSelectedItem({}));
          //           history.push({
          //             pathname: url + "/add",
          //             state: {
          //               year: parseInt(bmonths[active]?.year),
          //               month: parseInt(bmonths[active]?.month),
          //             },
          //           });
          //         }}
          //       />
          //     )}
          //   </>,
          // ]}
          // deleteSelection={(selectedRows, rows) => {
          //   Object.keys(selectedRows).map((el) =>
          //     dispatch(deleteBillingUnitItem(rows[el].original.id))
          //   );
          // }}
          // renderActions={
          //   view
          //     ? null
          //     : (selectedRowIds, page) => {
          //         return [
          //           <>
          //             <Button
          //               label="Set as Paid Selected"
          //               disabled={
          //                 Object.keys(selectedRowIds).length === 0
          //               }
          //               icon={<FiCheck />}
          //               onClick={() => {
          //                 confirmAlert({
          //                   title: "Set as Paid Billing",
          //                   message:
          //                     "Do you want to set selected billing as Paid?",
          //                   buttons: [
          //                     {
          //                       label: "Yes",
          //                       onClick: () => {
          //                         dispatch(
          //                           updateSetAsPaidSelectedDetail(multiActionRows)
          //                         );
          //                       },
          //                       className: "Button btn btn-secondary",
          //                     },
          //                     {
          //                       label: "Cancel",
          //                       className: "Button btn btn-cancel",
          //                     },
          //                   ],
          //                 });
          //               }}
          //             />
          //           </>,
          //         ];
          //       }
          // }
        />
      </div>
    </>
  );
}

export default Component;
