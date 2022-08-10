import React, { useEffect, useCallback, useState } from "react";
import { FiSearch, FiCheck, FiPercent } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import Button from "../../../../components/Button";
import TableWithSelection from "../../../../components/TableWithSelection";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Filter from "../../../../components/Filter";
import { toSentenceCase, toMoney } from "../../../../utils";

import {
  refresh,
} from "../../../slices/product";
import { endpointMerchant, merchant_types } from "../../../../settings";
import { get, patch, post, setInfo } from "../../../slice";
import Pill from '../../../../components/Pill';
import Product from '../../../../components/cells/Product';
import { FaMoneyBillWaveAlt } from "react-icons/fa";

const columns = [
    { Header: 'ID', accessor: 'id' },
    {
        Header: 'Product', accessor: row => <Product id={row.id} data={row} merchantName={row.merchant_name}/>
    },
    { Header: 'Display Price', accessor: row => {
        return row.discount_fee > 0 ? <div style={{ display: 'block' }} >
            <div style={{ textDecoration: 'line-through' }} >{toMoney(row.total_selling_price)}</div>
            <div>{toMoney(row.total_selling_price - row.discount_price)}</div>
            </div> : <span>{toMoney(row.total_selling_price)}</span>
        }
    },
    { Header: 'Category', accessor: 'category_name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.item_type) },
    { Header: 'Admin Fee', accessor: row => row.admin_fee + '%' },
    { Header: 'Discount', accessor: row => <span className={row.discount_fee > 0 ? "HighlightValue-Red" : ""} >
        {row.discount_fee + '%'}</span> 
    },
    { Header: 'Status', accessor: row => <Pill color={row.status === 'active' ? "success" : "secondary"}>
        {toSentenceCase(row.status)}</Pill> },
]

function Component({ id, view}) {

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [] });
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState("");
  const [catName, setCatName] = useState("");
  const [type, setType] = useState("");
  const [limitCats, setLimitCats] = useState(5);
  const [multiActionRows, setMultiActionRows] = useState([]);
  const [modalOnOff, setModalOnOff] = useState(false);
  const [productStatus, setProductStatus] = useState("active");
  const [adminFee, setAdminFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [modalDiscount, setModalDiscount] = useState(false);
  const [modalAdminFee, setModalAdminFee] = useState(false);

  const { refreshToggle } = useSelector(
    (state) => state.product
  );

  let dispatch = useDispatch();

    useEffect(() => {
        (!search || search.length >= 1) && dispatch(get(endpointMerchant + '/admin/categories?name=' + search, res => {
            let data = res.data.data;
            let formatted = data.map(el => ({ label: el.name, value: el.id }));
            let limited = formatted.slice(0, limitCats);
            
            const restTotal = formatted.length - limited.length;
            const valueLimit = 5;

            if (limited.length < formatted.length) {
                limited.push({
                    label: 'load ' + (restTotal > valueLimit ? valueLimit : restTotal) + ' more',
                    className: 'load-more',
                    restTotal: restTotal > valueLimit ? valueLimit : restTotal
                })
            }

            setCategories(limited);
        }))
    }, [search, dispatch, limitCats]);

  return (
    <>
        <Modal
            isOpen={modalOnOff}
            toggle={() => { setModalOnOff(false) }}
            title="Set status"
            okLabel={"Submit"}
            onClick={() => {
                dispatch(patch(endpointMerchant+"/admin/items/bulk/setstatus", {
                "product_id": multiActionRows,
                "status": productStatus,
                }, res => {
                    dispatch(
                    setInfo({
                        color: "success",
                        message: `Product(s) status has been updated.`,
                    })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                }, err => {
                dispatch(
                    setInfo({
                    color: "error",
                    message: `Set product status error.`,
                    })
                );
                console.log("error");
                }))
                // dispatch(stopAsync());
                setModalOnOff(false);
                dispatch(refresh());
            }}
        > 
            <Input
                label="Set product status"
                type="radio"
                name="status"
                options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                ]}
                inputValue={productStatus}
                setInputValue={setProductStatus}
            /> 

        </Modal>
        <Modal
            isOpen={modalDiscount}
            toggle={() => { setModalDiscount(false) }}
            title="Set discount"
            okLabel={"Submit"}
            onClick={() => {
                dispatch(patch(endpointMerchant+"/admin/items/bulk/setdiscount", {
                "product_id": multiActionRows,
                "discount": parseInt(discount),
                }, res => {
                    dispatch(
                    setInfo({
                        color: "success",
                        message: `Product(s) dicount has been updated.`,
                    })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                }, err => {
                dispatch(
                    setInfo({
                    color: "error",
                    message: `Set product discount error.`,
                    })
                );
                console.log("error");
                }))

                // dispatch(stopAsync());
                setModalDiscount(false)
                dispatch(refresh());
            }}
        > 
            <Input
                label="Set product(s) discount"
                name="discount"
                type="text"
                placeholder="0"
                inputValue={discount}
                setInputValue={setDiscount}
                addons="%"
                onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                    }
                }}
                hint="input value 0 to 100"
            /> 

        </Modal>
        <Modal
            isOpen={modalAdminFee}
            toggle={() => { setModalAdminFee(false) }}
            title="Set admin fee"
            okLabel={"Submit"}
            onClick={() => {
                dispatch(patch(endpointMerchant+"/admin/items/bulk/setadminfee", {
                "product_id": multiActionRows,
                "admin_fee": parseInt(adminFee),
                }, res => {
                    dispatch(
                    setInfo({
                        color: "success",
                        message: `Product(s) admin fee's has been updated.`,
                    })
                    );
                    // resultComponent ? setOpenRes(true) : toggle();
                }, err => {
                dispatch(
                    setInfo({
                    color: "error",
                    message: `Set admin fee error.`,
                    })
                );
                console.log("error");
                }))

                // dispatch(stopAsync());
                setModalAdminFee(false)
                dispatch(refresh());
            }}
        > 
            <Input
                label="Set product(s) admin fee"
                name="admin_fee"
                type="text"
                placeholder="0"
                inputValue={adminFee}
                setInputValue={setAdminFee}
                addons="%"
                onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                    }
                }}
                hint="input value 0 to 100"
            /> 

        </Modal>
        <TableWithSelection
            columns={columns}
            data={data?.items || []}
            onSelection={(selectedRows) => {
                const selectedRowIds = [];
                selectedRows.map((row) => {
                if (row !== undefined){
                    selectedRowIds.push(row.id);
                }
                });    
                setMultiActionRows([...selectedRowIds]);
                console.log(selectedRowIds);
            }}
            fetchData={useCallback(
              (page, limit, searchItem, sortField, sortType) => {
                setLoading(true);
                dispatch(
                  get(
                    endpointMerchant +
                    "/admin/items/list" +
                    "?page=" + (page + 1) +
                    "&limit=" + limit +
                    "&merchant_id=" + id +
                    "&category_id=" + category +
                    "&merchant_type=" + type +
                    "&sort_field=created_on&sort_type=DESC" +
                    "&search=" + searchItem,
                    (res) => {
                      console.log(res.data.data);
                      setData(res.data.data);
                      setLoading(false);
                    }
                  )
                );
                // eslint-disable-next-line react-hooks/exhaustive-deps
              },
              [dispatch, category, type, id, refreshToggle]
            )}
            loading={loading}
            pageCount={data?.filtered_page}
            totalItems={data?.filtered_item}
            filters={[
              {
                label: (
                  <p>
                    {"Type: " +
                      (type ? type : "All")}
                  </p>
                ),
                hidex: type === "",
                delete: () => setType(""),
                component: (toggleModal) => (
                  <>
                    <Filter
                      data={merchant_types}
                      onClick={(el) => {
                        setType(el.value);
                        toggleModal(false);
                      }}
                      onClickAll={() => {
                        setType("");
                        toggleModal(false);
                      }}
                    />
                  </>
                ),
              },
              {
                label: (
                  <p>
                    {"Category: " +
                      (category ? catName : "All")}
                  </p>
                ),
                hidex: category === "",
                delete: () => setCategory(""),
                component: (toggleModal) => (
                  <>
                    <Input
                        label="Search"
                        compact
                        icon={<FiSearch />}
                        inputValue={search}
                        setInputValue={setSearch}
                    />
                    <Filter
                      data={categories}
                      onClick={(el) => {
                        setCategory(el.value);
                        setCatName(el.label);
                        setLimitCats(5);
                        toggleModal(false);
                      }}
                      onClickAll={() => {
                        setCategory("");
                        setCatName("");
                        setLimitCats(5);
                        toggleModal(false);
                      }}
                    />
                  </>
                ),
              },
            ]}
            renderActions={view ? null : (selectedRowIds) => {
                return [
                    <Button
                        label="On/Off Product"
                        disabled={Object.keys(selectedRowIds).length === 0}
                        icon={<FiCheck />}
                        onClick={() =>
                            setModalOnOff(true) 
                        }
                    />,
                    <Button
                        label="Set Discount"
                        disabled={Object.keys(selectedRowIds).length === 0}
                        icon={<FiPercent />}
                        onClick={() =>
                            setModalDiscount(true)
                        }
                    />,
                    <Button
                        label="Admin Fee"
                        disabled={Object.keys(selectedRowIds).length === 0}
                        icon={<FaMoneyBillWaveAlt />}
                        onClick={() =>
                            setModalAdminFee(true)
                        }
                    />,
                ]}
            }
          />      
    </>
  );
}

export default Component;
