import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Pill from '../../components/Pill';
import {
    getProduct,
} from '../slices/product';
import { merchant_types, endpointMerchant } from '../../settings';
import { toSentenceCase, toMoney } from '../../utils';
import { FiSearch } from 'react-icons/fi';
import { get } from '../slice';
import Product from '../../components/cells/Product'; 

import Template from './components/Template';

const columns = [
    { Header: 'ID', accessor: 'id' },
    {
        Header: 'Product', accessor: row => <Product id={row.id} data={row} merchantName={row.merchant_name}/>
    },
    { Header: 'Selling Price', accessor: row => {
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

function Component() {
    const [search, setSearch] = useState('');

    const [merchant, setMerchant] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [merchants, setMerchants] = useState('');
    const [limit, setLimit] = useState(5);

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const [type, setType] = useState('');

    let dispatch = useDispatch();

    useEffect(() => {
        (!search || search.length >= 1) && dispatch(get(endpointMerchant + '/admin/list' +
            '?limit=' + limit + '&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;
                let totalItems = Number(res.data.data.total_items);
                let restTotal = totalItems - data.length;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                if (data.length < totalItems) {
                    formatted.push({
                        label: 'load ' + (restTotal > 5 ? 5 : restTotal) + ' more',
                        restTotal: restTotal > 5 ? 5 : restTotal,
                        className: 'load-more'
                    })
                }

                setMerchants(formatted);
            }))
    }, [search, dispatch, limit]);

    useEffect(() => {
        (!search || search.length >= 1) && dispatch(get(endpointMerchant + '/admin/categories?name=' + search, res => {
            let data = res.data.data;
            let formatted = data.map(el => ({ label: el.name, value: el.id }));
            let limited = formatted.slice(0, limit);
            
            const restTotal = formatted.length - limited.length;
            const valueLimit = 5;

            if (limited.length < formatted.length) {
                limited.push({
                    label: 'load ' + (restTotal > valueLimit ? valueLimit : restTotal) + ' more',
                    className: 'load-more',
                    restTotal: restTotal > valueLimit ? valueLimit : restTotal
                })
            }

            setCats(limited);
        }))
    }, [search, dispatch, limit]);

    useEffect(() => {
        if (search.length === 0) setLimit(5);
    }, [search])

    return (
        <Template
            columns={columns}
            slice='product'
            getAction={getProduct}
            filterVars={[merchant, cat, type]}
            filters={[
                {
                    hidex: type === "",
                    label: <p>{type ? "Type: " + type : "Type: All"}</p>,
                    delete: () => { setType(""); },
                    component: (toggleModal) =>
                        <>
                            <Filter
                                data={merchant_types}
                                onClick={(el) => {
                                    setType(el.value);
                                    toggleModal(false);
                                    setSearch("");
                                }}
                                onClickAll={() => {
                                    setType("");
                                    toggleModal(false);
                                    setSearch("");
                                }}
                            />
                        </>
                },
                {
                    hidex: merchant === "",
                    label: <p>{merchant ? "Merchant: " + merchantName : "Merchant: All"}</p>,
                    delete: () => { setMerchant(""); },
                    component: (toggleModal) =>
                        <>
                            <Input
                                label="Search merchant here"
                                compact
                                icon={<FiSearch />}
                                inputValue={search}
                                setInputValue={setSearch}
                            />
                            <Filter
                                data={merchants}
                                onClick={(el) => {
                                    if (!el.value) {
                                        setLimit(limit + el.restTotal);
                                        setSearch('');
                                        return;
                                    }
                                    setMerchant(el.value);
                                    setMerchantName(el.label);
                                    setLimit(5);
                                    toggleModal(false);
                                    setSearch("");
                                }}
                                onClickAll={() => {
                                    setLimit(5);
                                    setMerchant("");
                                    setMerchantName("");
                                    toggleModal(false);
                                    setSearch("");
                                }}
                            />
                        </>
                },
                {
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
                                    toggleModal(false);
                                    setSearch("");
                                }}
                                onClickAll={() => {
                                    setCat("");
                                    setCatName("");
                                    toggleModal(false);
                                    setSearch("");
                                }}
                            />
                        </>
                },
            ]}
        />
    )
}

export default Component;
