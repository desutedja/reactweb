import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Add from './Add';
import Details from './Details';
import { getMerchant,setSelected} from './slice';
import { get } from '../../utils';
import { endpointMerchant } from '../../settings';
import { FiSearch } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'description', accessor: 'description' },
    { Header: 'Open', accessor: 'open_at' },
    { Header: 'Closed', accessor: 'closed_at' },
    { Header: 'Status', accessor: 'status' },
]

const types = [
    { label: 'Goods', value: 'goods' },
    { label: 'Services', value: 'services' },
];

function Component() {
    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [search, setSearch] = useState('');

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, refreshToggle, alert } = useSelector(state => state.merchant);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        get(endpointMerchant + '/admin/categories', headers, res => {
                let data = res.data.data;

                let formatted = data.map(el => ({ label: el.name, value: el.name }));

                setCats(formatted);
            })
    }, [headers]);

    return (
        <div>
            <Switch>
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getMerchant(headers, pageIndex, pageSize, search, type, cat));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, type, cat])}
                        filters={[
                            {
                                button: <Button key="Select Type"
                                    label={type ? typeLabel : "Select Type"}
                                    selected={type}
                                />,
                                component: toggleModal =>
                                    <Filter
                                        data={types}
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
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
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