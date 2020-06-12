import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Filter from '../../components/Filter';
import Add from './Add';
import Details from './Details';
import { getProduct, getProductDetails } from './slice';
import { endpointMerchant } from '../../settings';
import { get, toSentenceCase } from '../../utils';
import { FiSearch } from 'react-icons/fi';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Merchant Name', accessor: 'merchant_name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.item_type) },
    { Header: 'Base Price', accessor: 'base_price' },
    { Header: 'Admin Fee', accessor: row => row.admin_fee + '%' },
    { Header: 'Discount Fee', accessor: row => row.discount_fee + '%' },
    { Header: 'PG Fee', accessor: row => row.pg_fee + '%' },
    { Header: 'Selling Price', accessor: 'selling_price' },
]

function Component() {
    const [search, setSearch] = useState('');

    const [merchant, setMerchant] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [merchants, setMerchants] = useState('');

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, alert } = useSelector(state => state.product);

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
                            dispatch(getProduct(headers, pageIndex, pageSize, search, merchant, cat));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, merchant, cat])}
                        filters={[
                            {
                                button: <Button key="Select Merchant"
                                    label={merchant ? merchantName : "Select Merchant"}
                                    selected={merchant}
                                />,
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
                                button: <Button key="Select Catgeory"
                                    label={cat ? catName : "Select Category"}
                                    selected={cat}
                                />,
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
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route path={`${path}/details`}>
                    <Details />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;