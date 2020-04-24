import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getTaskDetails } from './slice';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import { get } from '../../utils';
import { endpointAdmin } from '../../settings';
import Details from './Details';

const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Type", accessor: "task_type" },
    { Header: "Requester", accessor: "requester_name" },
    { Header: "Building", accessor: "requester_building_name" },
    { Header: "Priority", accessor: "priority" },
    { Header: "Assigned by", accessor: row => row.assigner_firstname + ' ' + row.assigner_lastname },
    { Header: "Assignee", accessor: row => row.assignee_firstname + ' ' + row.assignee_lastname },
    { Header: "Assigned on", accessor: "assigned_on" },
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
    const [search, setSearch] = useState('');
    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

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

    useEffect(() => {
        search.length >= 3 && get(endpointAdmin + '/building' +
        '?limit=5&page=1' +
        '&search=' + search, headers, res => {
            let data = res.data.data.items;

            let formatted = data.map(el => ({label: el.name, value: el.id}));

            setBuildings(formatted);
        })
    }, [headers, search]);

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
                            dispatch(getTask(headers, pageIndex, pageSize, search, type, prio, status, building));
                        }, [dispatch, headers, type, prio, status, building])}
                        filters={[
                            {
                                button: <Button key="Select Building"
                                    label={building ? buildingName : "Select Building"}
                                    selected={building}
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
                                            data={buildings}
                                            onClick={(el) => {
                                                setBuilding(el.value);
                                                setBuildingName(el.label);
                                                toggleModal(false);
                                            }}
                                            onClickAll={() => {
                                                setBuilding("");
                                                setBuildingName("");
                                                toggleModal(false);
                                            }}
                                        />
                                    </>
                            },
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
                        onClickRow={rowID => dispatch(getTaskDetails(rowID, headers, history, url))}
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