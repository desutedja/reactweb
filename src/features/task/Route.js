import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getTaskDetails, resolveTask, reassignTask } from './slice';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { get } from '../../utils';
import { endpointAdmin, endpointManagement } from '../../settings';
import Details from './Details';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Type", accessor: "task_type" },
    { Header: "Requester", accessor: "requester_name" },
    { Header: "Building", accessor: "requester_building_name" },
    { Header: "Priority", accessor: "priority" },
    { Header: "Assigned by", accessor: row => row.assigner_firstname == null ? "Auto" : row.assigner_firstname + ' ' + row.assigner_lastname },
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
    const [selectedRow, setRow] = useState({});
    const [resolve, setResolve] = useState(false);
    const [assign, setAssign] = useState(false);
    const [role, setRole] = useState('');
    const [staff, setStaff] = useState({});
    const [staffs, setStaffs] = useState([]);

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
    const { loading, items, total_pages, refreshToggle } = useSelector(state => state.task);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        console.log(selectedRow);
        selectedRow.task_type === 'security' && setRole('security');
        selectedRow.task_type === 'service' && setRole('technician');
        selectedRow.task_type === 'delivery' && setRole('courier');
    }, [selectedRow])

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [headers, search]);

    useEffect(() => {
        (!search || search.length >= 3) && get(endpointManagement + '/admin/staff/list' +
            '?limit=5&page=1&max_ongoing_task=2' +
            '&staff_role=' + role +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.firstname + ' ' + el.lastname,
                    value: el.id
                }));

                setStaffs(formatted);
            })
    }, [headers, role, search]);

    return (
        <div>
            <Modal isOpen={resolve} onRequestClose={() => setResolve(false)}>
                Are you sure you want to resolve this task?
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setResolve(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setResolve(false);
                            dispatch(resolveTask(headers, selectedRow));
                        }}
                    />
                </div>
            </Modal>
            <Modal isOpen={assign} onRequestClose={() => setAssign(false)}>
                Choose assignee:
                {!staff.value && <Input label="Search" compact inputValue={search} setInputValue={setSearch} />}
                <Filter data={staff.value ? [staff] : staffs} onClick={el => setStaff(el)} />
                <div style={{
                    display: 'flex',
                    marginTop: 16,
                }}>
                    <Button label="No" secondary
                        onClick={() => setAssign(false)}
                    />
                    <Button label="Yes"
                        onClick={() => {
                            setStaff({});
                            setAssign(false);
                            dispatch(reassignTask(headers, {
                                "task_id": selectedRow.id,
                                "assignee_id": staff.value,
                            }));
                        }}
                    />
                </div>
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table
                        columns={columns}
                        data={items}
                        loading={loading}
                        pageCount={total_pages}
                        fetchData={useCallback((pageIndex, pageSize, search) => {
                            dispatch(getTask(headers, pageIndex, pageSize, search, type, prio, status, building));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, headers, refreshToggle, type, prio, status, building])}
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
                        onClickDetails={row => dispatch(getTaskDetails(row, headers, history, url))}
                        onClickResolve={row => {
                            setRow(row);
                            setResolve(true);
                        }}
                        onClickReassign={row => {
                            setRow(row);
                            setAssign(true);
                        }}

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
