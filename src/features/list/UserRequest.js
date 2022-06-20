import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormatterCell, toMoney, toSentenceCase } from "../../utils";
import { endpointAdmin, endpointInternet } from "../../settings";
import { get, setConfirmDelete, post, del } from "../slice";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import UserRequest from "../../components/cells/UserRequest";
import { deleteInternetProvider, setSelected, getInternetProvider } from "../slices/internet";
import Avatar from "react-avatar";


const columns = [
  
  // { Header: "ID", accessor: "id" },
  {
    Header: "Title",
    accessor: (row) => 
    <UserRequest
        id={row.id}
        data={row}
        items={[
          <>
          <b>Unpaid billing karna ada kesalahan</b>
          </>
        ]}
      />       
  },
  {
    Header: "Category",
    accessor: (row) => {
      return (
        <div>
            Billing
        </div>
      );
    },
  },
  {
    Header: "Status",
    accessor: (row) =>{
      return (
        <div>
              Waiting for Approval
        </div>
      );
    },
  },
  {
    Header: "Created On",
    accessor: (row) =>{
      return (
        <div>
          <div>
            {row.created_on ? dateTimeFormatterCell(row.created_on) : "-"}
          </div>
          <div>
            by System
          </div>
        </div>
      );
    },
  },
];

function Component({ view, title = '', pagetitle, canDelete }) {
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
  const [provider, setProvider] = useState("");

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");
  const [cats, setCats] = useState("");

  let dispatch = useDispatch();
  let history = useHistory();
  let { url } = useRouteMatch();
  const {
    refreshToggle
  } = useSelector(state => state['internet']);

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
                            endpointInternet +
                            "/admin/provider?" +
                            'page=' + (page + 1) +
                            '&limit=' + limit +
                            '&search=' + searchItem +
                            '&provider_id=' + provider,

                            (res) => {
                              console.log(res.data.data);
                              setData(res.data.data);
                              setLoading(false);
                            }
                          )
                        );
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                      },
                      [dispatch, provider, refreshToggle]
                    )}
                    loading={loading}
                    onClickEdit={
                      view
                        ? null
                        : (row) => {
                          
                          dispatch(setSelected(row));
                          history.push(url + "/edit");
                          console.log(row);
                        }
                          
                    }
                    onClickDelete={
                      view
                        ? null
                        : (row) => {
                            dispatch(
                              setConfirmDelete(
                                // "Are you sure you want to delete this internet provider?",
                                "Feature still under development",
                                () => {
                                  console.log(row);
                                  // dispatch(deleteInternetProvider(row, history));
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
                              key="Add User Request"
                              label="Add User Request"
                              icon={<FiPlus />}
                              onClick={() => {
                                dispatch(setSelected({}));
                                history.push(url + "/add");
                              }}
                            />,
                          ]
                    }
                    pageCount={data?.total_pages}
                    totalItems={data?.total_items}
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
                  {/* <TemplateInternet
                    view={view}
                    columns={columns}
                    slice='internet'
                    getAction={getInternetProvider}
                    deleteAction={deleteInternetProvider}
                    selectAction={(selectedRows) => {
                        const selectedRowIds = [];
                        selectedRows.map((row) => {
                        if (row !== undefined){
                            selectedRowIds.push({
                            merchant_id:row.id,
                            });
                        }
                        });    
                        setMultiActionRows([...selectedRowIds]);
                        console.log(selectedRowIds);
                    }}
                    filterVars={[type, cat]}
                    filters={[
                        {
                            hidex: type === "",
                            label: <p>{type ? "Type: " + typeLabel : "Type: All"}</p>,
                            delete: () => { setType(""); },
                            component: toggleModal =>
                                <Filter
                                    data={merchant_types}
                                    onClickAll={() => {
                                        setType("");
                                        setTypeLabel("");
                                        toggleModal(false);
                                    }}
                                    onClick={el => {
                                        setType(el.value);
                                        setTypeLabel(el.label);
                                        toggleModal(false);
                                    }}
                                />
                        },
                        {
                            button: <Button key="Catgeory: All"
                                label={cat ? catName : "Category: All"}
                                selected={cat}
                            />,
                            hidex: cat === "",
                            label: <p>{cat ? "Category: " + catName : "Category: All"}</p>,
                            delete: () => { setCat(""); },
                            component: (toggleModal) =>
                                <>
                                    <Input
                                        label="Search"
                                        compact
                                        icon={<FiSearch />}
                                        inputValue={search}
                                        setInputValue={setSearch}
                                    />
                                    <Filter
                                        data={cats}
                                        onClick={(el) => {
                                            if (!el.value) {
                                                setLimit(limit + el.restTotal);
                                                return;
                                            }
                                            setCat(el.value);
                                            setCatName(el.label);
                                            setLimit(5);
                                            toggleModal(false);
                                            setSearch("");
                                        }}
                                        onClickAll={() => {
                                            setCat("");
                                            setCatName("");
                                            setLimit(5);
                                            toggleModal(false);
                                            setSearch("");
                                        }}
                                    />
                                </>
                        },
                    ]}
                    renderActions={view ? null : (selectedRowIds) => {
                        return [
                          <Button
                            key="Add Provider"
                            label="Add Provider"
                            icon={<FiPlus />}
                            onClick={() => {
                              dispatch(setSelected({}));
                              history.push(url + "/add");
                            }}
                          />,
                    ]}
                }
            /> */}
            </div>
    </>              
  );
}

export default Component;
