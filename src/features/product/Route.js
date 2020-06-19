import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Details from './Details';
import { getProduct, getProductDetails } from './slice';
import { merchant_types, endpointMerchant } from '../../settings';
import { get, toSentenceCase, toMoney } from '../../utils';
import { FiSearch } from 'react-icons/fi';
import UserAvatar from '../../components/UserAvatar';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Product', accessor: row => <UserAvatar fullname={row.name} email={toMoney(row.total_selling_price)} 
        picture={row.thumbnails} round={5}/>},
    { Header: 'Merchant Name', accessor: 'merchant_name' },
    { Header: 'Category', accessor: 'category_name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.item_type) },
    //{ Header: 'Base Price', accessor: row => toMoney(row.base_price) },
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

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.product);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointMerchant + '/admin/list' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setMerchants(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        get(endpointMerchant + '/admin/categories', headers, res => {
                let data = res.data.data;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setCats(formatted);
            })
    }, [headers]);

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getProduct(headers, pageIndex, pageSize, search, merchant, cat, type));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, merchant, cat, type])}
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
                        actions={[]}
                        onClickDetails={row => dispatch(getProductDetails(row, headers, history, url))}
                    />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
