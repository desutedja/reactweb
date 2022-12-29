import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dateTimeFormatterCell,
  dateTimeFormatterstriped,
  toMoney,
  toSentenceCase,
} from "../../utils";
import { endpointAdmin } from "../../settings";
import { get, setConfirmDelete, post, del } from "../slice";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Pill from "../../components/Pill";
import { setSelected } from "../slices/vouchers";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import { deleteVA, editVA } from "../slices/promova";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import MultiSelectInput from "../form/input/MultiSelect";
import Tab from "../../components/Tab";
import Filter from "../../components/Filter";
import Booking from "../../components/cells/Booking";
import Facilities from "../../components/cells/Facilities";

const residentColumns = [
  // { Header: "ID", accessor: "id" },
  // {
  //   Header: "Resident Name",
  //   accessor: (row) =>
  //     <b>Dadang Jordan</b>
  // },
  {
    Header: "Resident Name",
    accessor: (row) => (
      <Booking
        // id={row.id}
        id={1}
        data={row}
        items={[<b>Dadang Jordan</b>]}
      />
    ),
  },
  {
    Header: "Facilities",
    accessor: (row) => <b>Yipy Gym</b>,
  },
  {
    Header: "Status",
    accessor: (row) => (
      // row.status === "scheduled" ?
      //   <Pill color="secondary">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      //   :
      // row.status === "ongoing" ?
      //   <Pill color="warning">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      //   :
      //   <Pill color="primary">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      <font style={{ color: "#FFC200" }}>
        <b>Booked</b>
      </font>
    ),
  },
  {
    Header: "Created Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.created_on ? dateTimeFormatterstriped(row.created_on) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },
];

const facilityColumns = [
  // { Header: "ID", accessor: "id" },
  // {
  //   Header: "Facility Name",
  //   accessor: (row) =>
  //     <b>Yipy Gym</b>
  // },
  {
    Header: "Facility Name",
    accessor: (row) => (
      <Facilities
        // id={row.id}
        id={102}
        data={row}
        items={[<b>Yipy Gym</b>]}
      />
    ),
  },
  {
    Header: "Quota",
    accessor: (row) => <b>100</b>,
  },
  {
    Header: "Duration",
    accessor: (row) => <b>1 hour</b>,
  },
  {
    Header: "Status",
    accessor: (row) => (
      // row.status === "scheduled" ?
      //   <Pill color="secondary">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      //   :
      // row.status === "ongoing" ?
      //   <Pill color="warning">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      //   :
      //   <Pill color="primary">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      <font style={{ color: "#52A452" }}>
        <b>Open</b>
      </font>
    ),
  },
  {
    Header: "Created Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.created_on ? dateTimeFormatterstriped(row.created_on) : "-"}
            </b>
          </div>
        </div>
      );
    },
  },
];

const listBookingStat = [
  { label: "Booked", value: "booked" },
  { label: "Check-In", value: "check_in" },
  { label: "Check-Out", value: "check_out" },
  { label: "Canceled", value: "canceled" },
];

const listFacilities = [
  { label: "Gym", value: "gym" },
  { label: "Pool", value: "pool" },
  { label: "Restaurant", value: "restaurant" },
];

const listFacStat = [
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
];

function Component({ view, title = "", pagetitle, canDelete }) {
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [buildingid, setBuildingid] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");
  const [toggle, setToggle] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const [updatePromoModal, setUpdatePromoModal] = useState(false);
  const [startPromo, setStartPromo] = useState("");
  const [endPromo, setEndPromo] = useState("");
  const [dataPromo, setDataPromo] = useState({ items: [] });
  const [bManagements, setBManagements] = useState([]);
  const [dataBanks, setDataBanks] = useState([]);
  const [inBuildings, setBuildings] = useState([]);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");
  const [cats, setCats] = useState("");

  const tabs = ["Booking by Resident", "List of Facilities"];
  const [stat, setStat] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [faci, setFaci] = useState("");
  const [faciLabel, setFaciLabel] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  // useEffect(() => {
  //   dispatch(
  //     get(endpointAdmin + "/centratama/vouchers/list?name=" + search, (res) => {
  //       let data = res.data.data;
  //       let formatted = data.map((el) => ({ label: el.name, value: el.name }));
  //       let limited = formatted.slice(0, limit);

  //       const restTotal = formatted.length - limited.length;
  //       const valueLimit = 5;

  //       if (limited.length < formatted.length) {
  //         limited.push({
  //           label:
  //             "load " +
  //             (restTotal > valueLimit ? valueLimit : restTotal) +
  //             " more",
  //           className: "load-more",
  //           restTotal: restTotal > valueLimit ? valueLimit : restTotal,
  //         });
  //       }

  //       setCats(limited);
  //     })
  //   );
  // }, [dispatch, limit, search]);

  // useEffect(() => {
  //   if (search.length === 0) {
  //     setLimit(5);
  //   }
  // }, [search]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/management/building" +
          "?limit=10&page=1" +
          "&search=",
        (res) => {
          let data = res.data.data.items;

          let formatted = data.map((el) => ({
            label: el.building_name + " by " + el.management_name,
            value: el.id,
          }));

          setBManagements(formatted);
        }
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(endpointAdmin + "/paymentperbuilding/list/payment_method", (res) => {
        const banks = res.data.data.items.map((el) => ({
          value: el.id,
          label: toSentenceCase(el.provider),
        }));

        // console.log(banks)

        dispatch(setDataBanks(banks));
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      get(
        endpointAdmin +
          "/paymentperbuilding/list?status=all" +
          "&start_date=" +
          startdate +
          "&end_date=" +
          enddate +
          "&building_id=" +
          buildingid +
          "&bank=" +
          bank +
          "&sort_field=created_on&sort_type=DESC" +
          "&limit=" +
          limit,

        (res) => {
          console.log(res.data.data);
          setDataPromo(res.data.data);
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      <Breadcrumb title={title} />
      <h2 className="PageTitle">Booking</h2>
      <div className="Container">
        <Tab
          labels={tabs}
          setTab={setType}
          activeTab={0}
          contents={[
            <Table
              columns={residentColumns}
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
                        "/paymentperbuilding/list?status=all" +
                        "&start_date=" +
                        startdate +
                        "&end_date=" +
                        enddate +
                        "&building_id=" +
                        buildingid +
                        "&bank=" +
                        bank +
                        "&sort_field=created_on&sort_type=DESC" +
                        "&limit=" +
                        limit,

                      (res) => {
                        console.log(res.data.data);
                        setData(res.data.data);
                        setLoading(false);
                      }
                    )
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch, buildingid, bank, startdate, enddate]
              )}
              loading={loading}
              // onClickChange={
              //   view
              //     ? null
              //     : (row) => {

              //       dispatch(setSelected(row));
              //       history.push(url + "/edit");
              //       console.log(row)
              //     }

              // }
              // onClickStop={
              //   view
              //     ? null
              //     : role === "bm" && !canDelete
              //     ? null
              //     : (row) => {
              //         dispatch(
              //           setConfirmDelete(
              //             // "Are you sure to end this promo?",
              //             "Feature still under development",
              //             () => {
              //               // dispatch(deleteVA(row));
              //             }
              //           )
              //         );
              //       }
              // }
              // actions={
              //   view
              //     ? null
              //     : [
              //         <Button
              //           key="Add Promo VA"
              //           label="Add Promo VA"
              //           icon={<FiPlus />}
              //           onClick={() => {
              //             dispatch(setSelected({}));
              //             history.push(url + "/add");
              //           }}
              //         />,
              //       ]
              // }
              // pageCount={data?.total_pages}
              // totalItems={data?.total_items}
              filters={[
                {
                  label: (
                    <p>
                      {faci ? (
                        <div>
                          Facility: <b>{faciLabel}</b>
                        </div>
                      ) : (
                        <div>
                          Facility: <b>All</b>
                        </div>
                      )}
                    </p>
                  ),
                  hidex: faci === "",
                  delete: () => setFaci(""),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={listFacilities}
                        onClick={(el) => {
                          setFaci(el.value);
                          setFaciLabel(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setFaci("");
                          setFaciLabel("");
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
                {
                  label: (
                    <p>
                      {stat ? (
                        <div>
                          Status: <b>{statLabel}</b>
                        </div>
                      ) : (
                        <div>
                          Status: <b>All</b>
                        </div>
                      )}
                    </p>
                  ),
                  hidex: stat === "",
                  delete: () => setStat(""),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={listBookingStat}
                        onClick={(el) => {
                          setStat(el.value);
                          setStatLabel(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setStat("");
                          setStatLabel("");
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
            />,
            <Table
              columns={facilityColumns}
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
                        "/paymentperbuilding/list?status=all" +
                        "&start_date=" +
                        startdate +
                        "&end_date=" +
                        enddate +
                        "&building_id=" +
                        buildingid +
                        "&bank=" +
                        bank +
                        "&sort_field=created_on&sort_type=DESC" +
                        "&limit=" +
                        limit,

                      (res) => {
                        console.log(res.data.data);
                        setData(res.data.data);
                        setLoading(false);
                      }
                    )
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch, buildingid, bank, startdate, enddate]
              )}
              loading={loading}
              onClickDelete={
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
                        key="Add Facilities"
                        label="Add Facilities"
                        icon={<FiPlus />}
                        onClick={() => {
                          dispatch(setSelected({}));
                          history.push(url + "/add");
                        }}
                      />,
                    ]
              }
              // pageCount={data?.total_pages}
              // totalItems={data?.total_items}
              filters={[
                {
                  label: (
                    <p>
                      {faci ? (
                        <div>
                          Facility: <b>{faciLabel}</b>
                        </div>
                      ) : (
                        <div>
                          Facility: <b>All</b>
                        </div>
                      )}
                    </p>
                  ),
                  hidex: faci === "",
                  delete: () => setFaci(""),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={listFacilities}
                        onClick={(el) => {
                          setFaci(el.value);
                          setFaciLabel(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setFaci("");
                          setFaciLabel("");
                          toggleModal(false);
                        }}
                      />
                    </>
                  ),
                },
                {
                  label: (
                    <p>
                      {stat ? (
                        <div>
                          Status: <b>{statLabel}</b>
                        </div>
                      ) : (
                        <div>
                          Status: <b>All</b>
                        </div>
                      )}
                    </p>
                  ),
                  hidex: stat === "",
                  delete: () => setStat(""),
                  component: (toggleModal) => (
                    <>
                      <Filter
                        data={listFacStat}
                        onClick={(el) => {
                          setStat(el.value);
                          setStatLabel(el.label);
                          toggleModal(false);
                        }}
                        onClickAll={() => {
                          setStat("");
                          setStatLabel("");
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
            />,
          ]}
        />
      </div>
    </>
  );
}

export default Component;
