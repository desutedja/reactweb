import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dateTimeFormatterstriped,
  toSentenceCase,
} from "../../utils";
import { endpointAdmin,endpointBookingFacility } from "../../settings";
import { get, setConfirmDelete, post, del, getWithHeader } from "../slice";

import { deleteFacility } from "../slices/facility";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Pill from "../../components/Pill";
import { setSelected } from "../slices/facility";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Tab from "../../components/Tab";
import Filter from "../../components/Filter";
import Facilities from "../../components/cells/Facilities";
import { FiSearch } from "react-icons/fi";
// import { auth } from "firebase";

const bookingColumns = [
  {
    Header: "Booking Number",
    accessor: (row) => (
      // <Booking
      //   id={row.booking_id}
      //   data={row}
      //   items={[<b>{row.booking_number}</b>]}
      // />
      <b>{row.booking_number}</b>
    ),
  },
  {
    Header: "Facilities",
    accessor: (row) => <b>Yipy Gym</b>,
  },
  {
    Header: "Status",
    accessor: (row) => (
      row.status === "Booked" ?
        <Pill color="warning">
          {toSentenceCase(row.status)}
        </Pill>
        :
      row.status === "Cancel" ?
        <Pill color="primary">
          {toSentenceCase(row.status)}
        </Pill>
        :
      row.status === "CheckedIn" ?
      <Pill color="success">
        {toSentenceCase(row.status)}
      </Pill>
        :
      <Pill color="secondary">
        {toSentenceCase(row.status)}
      </Pill>
    ),
  },
  {
    Header: "Created Date",
    accessor: (row) => {
      return (
        <div>
          <div>
            <b>
              {row.created_date ? dateTimeFormatterstriped(row.created_date) : "-"}
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
    Header: "Building Name",
    accessor: (row) => "building name",
  },
  {
    Header: "Facility Name",
    accessor: (row) => (
      <Facilities
        id={row.facility_id}
        data={row}
        items={[row.facility_name]}
      />
    ),
  },
  {
    Header: "Booking/Quota",
    accessor: (row) => row.used_quota_per_duration +"/"+row.total_quota_per_duration,
  },
  // {
  //   Header: "Quota",
  //   accessor: (row) => <b>100</b>,
  // },
  // {
  //   Header: "Duration",
  //   accessor: (row) => <b>1 hour</b>,
  // },
  {
    Header: "Status",
    accessor: (row) => (
      row.status === "Closed" ?
        <Pill color="secondary">
          {toSentenceCase(row.status)}
        </Pill>
        :
      // row.status === "ongoing" ?
      //   <Pill color="warning">
      //     {toSentenceCase(row.status)}
      //   </Pill>
      //   :
        <Pill color="primary">
          {toSentenceCase(row.status)}
        </Pill>
      // <font style={{ color: "#52A452" }}>
      //   <b>Open</b>
      // </font>
    ),
  },
  // {
  //   Header: "Created Date",
  //   accessor: (row) => {
  //     return (
  //       <div>
  //         <div>
  //           <b>
  //             {row.created_on ? dateTimeFormatterstriped(row.created_on) : "-"}
  //           </b>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
];

const listBookingStat = [
  { label: "Booked", value: "1" },
  { label: "Check-In", value: "2" },
  { label: "Check-Out", value: "3" },
  { label: "Canceled", value: "4" },
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

function Component({ view, title = "", pagetitle, canAdd, canDelete }) {
  const [buildingid, setBuildingid] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });
  const [dataBooking, setDataBooking] = useState({ items: [] });
  const [status, setStatus] = useState("");
  const [building, setBuilding] = useState("");
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");
  const [toggle, setToggle] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const { auth } = useSelector((state) => state);
  const [buildingLabel, setBuildingLabel] = useState("");
  const [buildingList, setBuildingList] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const tabs = ["Booking by Resident", "List of Facilities"];
  const [stat, setStat] = useState("");
  const [statLabel, setStatLabel] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();

  useEffect(() => {
    (!search || search.length >= 1) &&
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

            let formatted = data.map((el) => ({
              label: el.name,
              value: el.id,
            }));

            if (data.length < totalItems && search.length === 0) {
              formatted.push({
                label: "Load " + (restTotal > 5 ? 5 : restTotal) + " more",
                restTotal: restTotal > 5 ? 5 : restTotal,
                className: "load-more",
              });
            }

            setBuildingList(formatted);
          }
        )
      );
  }, [dispatch, search, limit]);

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
              columns={bookingColumns}
              data={dataBooking?.items || []}
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
                (page, limit, sortField, sortType) => {
                  setLoading(true);
                  dispatch(
                    get(
                      endpointBookingFacility +
                        "/admin/bookings?status=" +
                        status +
                        "&building_id=" +
                        building +
                        "&limit=" +
                        limit +
                        "&page=" +
                        (page + 1),

                      (res) => {
                        console.log(JSON.stringify(res.data))
                        setDataBooking(res.data);
                        setLoading(false);
                      }
                    )
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch, building]
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
              filters={
                role == "sa" ? 
                [
                  {
                    label: "Building: ",
                    value: building ? buildingLabel : "All",
                    hidex: building === "",
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
                          data={buildingList}
                          onClick={(el) => {
                            if (!el.value) {
                              setLimit(limit + el.restTotal);
                              return;
                            }
                            setBuilding(el.value);
                            setBuildingLabel(el.label);
                            setLimit(5);
                            toggleModal(false);
                          }}
                          onClickAll={() => {
                            setBuilding("");
                            setBuildingLabel("");
                            setLimit(5);
                            toggleModal(false);
                          }}
                        />
                      </>
                    ),
                  },
                  {
                    label: (
                      <div>
                        {stat ? (
                          <div>
                            Status: <b>{statLabel}</b>
                          </div>
                        ) : (
                          <div>
                            Status: <b>All</b>
                          </div>
                        )}
                      </div>
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
                ]:[
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
                ]
              }
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
                (page, limit, searchItem) => {
                  role !== "sa" ? setBuilding(auth.building_id) : setBuilding(building);
                  setLoading(true);
                  dispatch(
                    get(
                      endpointBookingFacility +
                        "/admin/facilities" +
                        "?building=" +
                        building +
                        "&search=" +
                        searchItem +
                        "&limit=" +
                        limit +
                        "&page=" +
                        (page + 1),
                      (res) => {
                        setData(res.data);
                        setLoading(false);
                      }
                    )
                  );
                  // eslint-disable-next-line react-hooks/exhaustive-deps
                },
                [dispatch, building]
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
                          "Are you sure to delete this facility?",
                          () => {
                            dispatch(deleteFacility(row.facility_id, history))
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
              filters={
                role == "sa" ?
                [
                  {
                    label: "Building: ",
                    value: building ? buildingLabel : "All",
                    hidex: building === "",
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
                          data={buildingList}
                          onClick={(el) => {
                            if (!el.value) {
                              setLimit(limit + el.restTotal);
                              return;
                            }
                            setBuilding(el.value);
                            setBuildingLabel(el.label);
                            setLimit(5);
                            toggleModal(false);
                          }}
                          onClickAll={() => {
                            setBuilding("");
                            setBuildingLabel("");
                            setLimit(5);
                            toggleModal(false);
                          }}
                        />
                      </>
                    ),
                  },
                ] : []
              }
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
