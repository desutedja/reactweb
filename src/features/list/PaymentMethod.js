import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { dateTimeFormatterCell, toMoney, toSentenceCase } from "../../utils";
import { endpointAdmin } from "../../settings";
import { get } from "../slice";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Pill from "../../components/Pill";
import { setSelected } from "../slices/vouchers";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";


const columns = [
  
  // { Header: "ID", accessor: "id" },
  {
    Header: "Bank",
    accessor: (row) => (
      <b>{toSentenceCase(row.provider)}</b>
    ),
  },
  {
    Header: "Target Building",
    accessor: (row) =>
      row.name
  },
  {
    Header: "Fee/Percentage/Markup",
    accessor: (row) => {
      return (
        <div>
          <div>
            Fee : <b>{row.fee}</b>
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
      row.start_date ? dateTimeFormatterCell(row.start_date) : "-",
  },
  {
    Header: "End Date",
    accessor: (row) =>
      row.end_date ? dateTimeFormatterCell(row.end_date) : "-",
  },
  {
    Header: "Created On",
    accessor: (row) =>{
      return (
        <div>
          <div>
            {
      row.created_on ? dateTimeFormatterCell(row.created_on) : "-"}
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
      row.status === "scheduled" ?
        <Pill color="secondary">
          {toSentenceCase(row.status)}
        </Pill>
        :
      row.status === "ongoing" ?
        <Pill color="warning">
          {toSentenceCase(row.status)}
        </Pill>
        :
        <Pill color="primary">
          {toSentenceCase(row.status)}
        </Pill> 
  },
];

function Component({ view, title = '', pagetitle }) {
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [buildingid, setBuildingid] = useState("");
  const [bank, setBank] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });
  const [type, setType] = useState("");
  const [typeLabel, setTypeLabel] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

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
    <>
      <h2 style={{ marginLeft: '16px' }}>{pagetitle}</h2>
            <Breadcrumb title={title} />
            <div className="Container">
                <Table
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
                            "/building/getpaymentchannel?status=all" +
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
                    // pageCount={data?.total_pages}
                    // totalItems={data?.total_items}
                    // filters={[
                    //   {
                    //     label: (
                    //       <p>
                    //         {"Status: " +
                    //           (status ? toSentenceCase(status) : "All")}
                    //       </p>
                    //     ),
                    //     hidex: status === "",
                    //     delete: () => setStatus(""),
                    //     component: (toggleModal) => (
                    //       <>
                    //         <Filter
                    //           data={[
                    //             { label: "Paid", value: "paid" },
                    //             { label: "Unpaid", value: "unpaid" },
                    //           ]}
                    //           onClick={(el) => {
                    //             setStatus(el.value);
                    //             toggleModal(false);
                    //           }}
                    //           onClickAll={() => {
                    //             setStatus("");
                    //             toggleModal(false);
                    //           }}
                    //         />
                    //       </>
                    //     ),
                    //   },
                    // ]}
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
