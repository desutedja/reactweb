import React, { useState, useEffect, useCallback } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dateTimeFormatterCell, toMoney, toSentenceCase } from "../../utils";
import { endpointAdmin } from "../../settings";
import { get, setConfirmDelete, post, del } from "../slice";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Pill from "../../components/Pill";
import { setSelected } from "../slices/vouchers";
import { FiPlus } from "react-icons/fi";

import Button from "../../components/Button";
import PromoVA from "../../components/cells/PromoVA";
import { deleteVA, editVA } from "../slices/promova";
import Modal from "../../components/Modal"
import Input from "../../components/Input"
import MultiSelectInput from "../form/input/MultiSelect";


const columns = [
  
  // { Header: "ID", accessor: "id" },
  {
    Header: "Bank",
    accessor: (row) => 
      <b>{toSentenceCase(row.provider)}</b>        
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
          {
          row.fee_type === "percentage" ?
            toSentenceCase(row.fee_type) + " : " + row.percentage + "%"
          :
          row.fee_type === "fee" ?
            toSentenceCase(row.fee_type) + " : " + toMoney(row.fee)
          :
            toSentenceCase(row.fee_type) + " : " + toMoney((parseInt(row.fee) + parseInt(row.fee * (row.percentage / 100))))
          }
          
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

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [cat, setCat] = useState("");
  const [catName, setCatName] = useState("");
  const [cats, setCats] = useState("");

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
      <Modal
        title="Update Promo"
        isOpen={updatePromoModal}
        toggle={() => setUpdatePromoModal(false)}
        okLabel="Submit"
        onClick={() => {
          setUpdatePromoModal(false);
          dispatch(
            editVA({
              // payment_perbuilding_id: dataPromo.id,
              // start_date: startPromo,
              // end_date: endPromo,
            })
          );
        }}
        cancelLabel="Cancel"
        onClickSecondary={() => {
          setUpdatePromoModal(false);
        }}
      >
        Change data for this promo
            {/* <MultiSelectInput    
              // type="multiselect"
              label="Bank"
              name="account_bank"
              autoComplete="off"
              placeholder={dataPromo.provider}
              options={dataBanks}
            />
            <MultiSelectInput
            
              // type="multiselect"
              label="Building Management"
              name="building_management_id"
              autoComplete="off"
              placeholder={dataPromo.name}
              options={bManagements}
            />
            <MultiSelectInput
            
              label="Fee Type"
              name="fee_type"
              autoComplete="off"
              placeholder={dataPromo.fee_type}
              options={[
                { value: "fee", label: "Fee" },
                { value: "percentage", label: "Percentage" },
                { value: "combination", label: "Combination" },
              ]}
            />
            {(dataPromo.fee_type) === "fee" ?
              <>
                <Input label="Fee" name="fee" autoComplete="off" suffix="Rp" />
              </>
              : (dataPromo.fee_type) === "percentage" ?
              <>
                <Input label="Percentage" name="percentage" autoComplete="off" suffix="%" />
              </>
              : (dataPromo.fee_type) === "combination" ?
              <>
                <Input label="Fee" name="fee" autoComplete="off" suffix="Rp" />
                <Input label="Percentage" name="percentage" autoComplete="off" suffix="%" />
              </>
              : null
            }
        <Input 
            label="Start Date"
            type="date"
            inputValue={startPromo}
            setInputValue={setStartPromo}
        />
        <Input 
            label="End Date"
            type="date"
            inputValue={endPromo}
            setInputValue={setEndPromo}
        /> */}
      </Modal>
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
                    onClickChange={
                      view
                        ? null
                        : (row) => {
                          
                          dispatch(setSelected(row));
                          history.push(url + "/edit");
                          console.log(row)
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
