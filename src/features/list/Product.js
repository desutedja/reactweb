import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Input from '../../components/Input';
import Filter from '../../components/Filter';
import { getProduct, getProductDetails } from '../slices/product';
import { merchant_types, endpointMerchant } from '../../settings';
import { toSentenceCase, toMoney } from '../../utils';
import { FiSearch } from 'react-icons/fi';
import UserAvatar from '../../components/UserAvatar';
import { get } from '../slice';

import Template from './components/Template';

const columns = [
    { Header: 'ID', accessor: 'id' },
    {
        Header: 'Product', accessor: row => <UserAvatar fullname={row.name} email={toMoney(row.total_selling_price)}
            picture={row.thumbnails} round={5} />
    },
    { Header: 'Merchant Name', accessor: 'merchant_name' },
    { Header: 'Category', accessor: 'category_name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.item_type) },
    { Header: 'Admin Fee', accessor: row => row.admin_fee + '%' },
    { Header: 'Discount', accessor: row => <span className={row.discount_fee > 0 ? "HighlightValue-Red" : ""} >{row.discount_fee + '%'}</span> },
    { Header: 'PG Markup', accessor: row => row.pg_fee + '%' },
    { Header: 'Selling Price', accessor: row => toMoney(row.selling_price) },
    { Header: 'Final Price', accessor: row => toMoney(row.total_selling_price) }
]

function Component() {
    const [search, setSearch] = useState('');

    const [merchant, setMerchant] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [merchants, setMerchants] = useState('');

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const [type, setType] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointMerchant + '/admin/list' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setMerchants(formatted);
            })
    }, [search]);

    useEffect(() => {
        get(endpointMerchant + '/admin/categories', res => {
            let data = res.data.data;

            let formatted = data.map(el => ({ label: el.name, value: el.id }));

            setCats(formatted);
        })
    }, []);

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
                                label="Search"
                                compact
                                icon={<FiSearch />}
                                inputValue={search}
                                setInputValue={setSearch}
                            />
                            <Filter
                                data={merchants}
                                onClick={(el) => {
                                    setMerchant(el.value);
                                    setMerchantName(el.label);
                                    toggleModal(false);
                                    setSearch("");
                                }}
                                onClickAll={() => {
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
            onClickDetails={row => dispatch(getProductDetails(row, history, url))}
        />
    )
}

export default Component;
