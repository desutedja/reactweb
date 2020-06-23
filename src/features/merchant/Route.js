import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Add from './Add';
import Details from '../details/merchant';
// import Details from './Details';
import { getMerchant, setSelected, deleteMerchant, getMerchantDetails } from './slice';
import { get, toSentenceCase, dateTimeFormatter } from '../../utils';
import { merchant_types, endpointMerchant } from '../../settings';
import { FiSearch } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import Tile from '../../components/Tile';
import Pill from '../../components/Pill';

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Type', accessor: row => toSentenceCase(row.type) },
    { Header: 'Category', accessor: row => toSentenceCase(row.category) },
    //{ Header: 'Description', accessor: 'description' },
    { Header: 'Open', accessor: row => {
        return <Tile items={[
            row.is_open === 1 ? <Pill color="primary">Open</Pill> : <Pill color="secondary">Closed</Pill>,
            row.is_open === 1 ? <div style={{ paddingTop: '5px', fontSize: ".9em" }}>Until {dateTimeFormatter(row.is_open_until)}
            </div> : <span></span>,
        ]}/>
      }
    },
    //{ Header: 'Closed', accessor: 'closed_at' },
    //{
    //    Header: 'Status', accessor: row =>
    //        <h5><Badge pill color={
    //            row.status ? 'success' : 'secondary'
    //        }>{toSentenceCase(row.status ? row.status : 'inactive')}</Badge></h5>
    //},
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [search, setSearch] = useState('');

    const [cat, setCat] = useState('');
    const [catName, setCatName] = useState('');
    const [cats, setCats] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } =
        useSelector(state => state.merchant);

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
            <Modal isOpen={confirm} toggle={() => setConfirm(false)}>
                Are you sure you want to delete?
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setConfirm(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setConfirm(false);
                            dispatch(deleteMerchant(selectedRow, headers));
                        }}
                    />
                </div>
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
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
                            <Button key="Add Merchant" label="Add Merchant" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add");
                                }}
                            />
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                        onClickDetails={row => dispatch(getMerchantDetails(row, headers, history, url))}
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
