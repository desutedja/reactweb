import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiPlus } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Pills from '../../components/Pills';
import { Badge } from 'reactstrap';
import { getResident, getResidentDetails, deleteResident, setSelected } from './slice';
import Add from './Add';
import AddSub from './AddSub';
import Details from './Details';
import { toSentenceCase } from '../../utils';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Name", accessor: row => row.firstname + ' ' + row.lastname },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Nationality", accessor: "nationality" },
    {
        Header: "Status", accessor: row => row.status ?
            <Badge pill color="success">{toSentenceCase(row.status)}</Badge>
            :
            <Badge pill color="secondary">Inactive</Badge>
    },
    {
        Header: "KYC Status", accessor: row => row.status_kyc ? row.status_kyc :
            <Badge pill color="secondary">None</Badge>
    },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.resident);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Modal isOpen={confirm} onRequestClose={() => setConfirm(false)}>
                Are you sure you want to delete this resident?
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
                            dispatch(deleteResident(selectedRow, headers));
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
                            dispatch(getResident(headers, pageIndex, pageSize, search));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, headers, refreshToggle])}
                        filters={[]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
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
                        onClickDetails={row => dispatch(getResidentDetails(row, headers, history, url))}
                    />
                </Route>
                <Route path={`${path}/add`}>
                    <Add />
                </Route>
                <Route path={`${path}/edit`}>
                    <Add />
                </Route>
                <Route exact path={`${path}/details`}>
                    <Details />
                </Route>
                <Route path={`${path}/details/add-subaccount`}>
                    <AddSub />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;
