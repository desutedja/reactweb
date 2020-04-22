import React, { useCallback, useState } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTask } from './slice';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';

const columns = [
    { Header: "Assigned on", accessor: "assigned_on" },
    { Header: "Task Type", accessor: "task_type" },
    { Header: "Requester Name", accessor: "requester_name" },
    { Header: "Priority", accessor: "priority" },
    { Header: "Lokasi", accessor: row => row.r_lat + ", " + row.r_long },
    { Header: "Assigned by", accessor: "assigned_by" },
    { Header: "Remarks", accessor: "remarks" },
    { Header: "Status", accessor: "status" },
]

const types = [
    { label: 'Security', value: 'security', },
    { label: 'Service', value: 'service', },
    { label: 'Delivery', value: 'delivery', },
]

const statuses = [
    { label: 'Created', value: 'created', },
    { label: 'Assigned', value: 'assigned', },
    { label: 'In Progress', value: 'in_progress', },
    { label: 'Reported', value: 'reported', },
    { label: 'Rejected', value: 'rejected', },
    { label: 'Approved', value: 'approved', },
]

const prios = [
    { label: 'Emergency', value: 'emergency', },
    { label: 'High', value: 'high', },
    { label: 'Normal', value: 'normal', },
    { label: 'Low', value: 'low', },
]

function Component() {
    const [type, setType] = useState('');
    const [typeLabel, setTypeLabel] = useState('');

    const [status, setStatus] = useState('');
    const [statusLabel, setStatusLabel] = useState('');

    const [prio, setPrio] = useState('');
    const [prioLabel, setPrioLabel] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages } = useSelector(state => state.task);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

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
                            dispatch(getTask(headers, pageIndex, pageSize, search, type, prio, status));
                        }, [dispatch, headers, type, prio, status])}
                        filters={[
                            {
                                button: <Button key="Select Type"
                                    label={type ? typeLabel : "Select Type"}
                                    selected={type}
                                />,
                                component: (toggleModal) =>
                                    <Filter
                                        data={types}
                                        onClick={(el) => {
                                            setType(el.value);
                                            setTypeLabel(el.label);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setType("");
                                            setTypeLabel("");
                                            toggleModal(false);
                                        }}
                                    />
                            },
                            {
                                button: <Button key="Select Priority"
                                    label={prio ? prioLabel : "Select Priority"}
                                    selected={prio}
                                />,
                                component: (toggleModal) =>
                                    <Filter
                                        data={prios}
                                        onClick={(el) => {
                                            setPrio(el.value);
                                            setPrioLabel(el.label);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setPrio("");
                                            setPrioLabel("");
                                            toggleModal(false);
                                        }}
                                    />
                            },
                            {
                                button: <Button key="Select Status"
                                    label={status ? statusLabel : "Select Status"}
                                    selected={status}
                                />,
                                component: (toggleModal) =>
                                    <Filter
                                        data={statuses}
                                        onClick={(el) => {
                                            setStatus(el.value);
                                            setStatusLabel(el.label);
                                            toggleModal(false);
                                        }}
                                        onClickAll={() => {
                                            setStatus("");
                                            setStatusLabel("");
                                            toggleModal(false);
                                        }}
                                    />
                            },
                        ]}
                        actions={[]}
                    />
                </Route>
            </Switch>
        </div>
    )
}

export default Component;