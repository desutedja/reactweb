import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTask, getTaskDetails, resolveTask, reassignTask, setSelected } from './slice';
import { FiSearch } from 'react-icons/fi';

import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { get, toSentenceCase, dateTimeFormatter, toEllipsis } from '../../utils';
import { endpointAdmin, endpointManagement, taskStatusColor } from '../../settings';
import Details from './Details';
import { Badge } from 'reactstrap';
import Tile from '../../components/Tile';

const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: row => <Tile items={[row.title, toEllipsis(row.ref_code, 15)]}/> },
    { Header: "Type", accessor: row => toSentenceCase(row.task_type) },
    { Header: "Requester", accessor: "requester_name" },
    { Header: "Building", accessor: "building_name" },
    {
        Header: "Priority", accessor: row =>
            <h5><Badge pill color={
                row.priority === "emergency" ? "danger" :
                    row.priority === "high" ? "warning" : "success"
            }>
                {toSentenceCase(row.priority)}
            </Badge></h5>
    },
    { Header: "Assigned by", accessor: row => row.assigner_firstname == null ? "Auto" : row.assigner_firstname + ' ' + row.assigner_lastname },
    { Header: "Assignee", accessor: row => row.assignee_firstname + ' ' + row.assignee_lastname },
    { Header: "Assigned on", accessor: row => row.assigned_on ? dateTimeFormatter(row.assigned_on) : "-" },
    {
        Header: "Status", accessor: row => row.status ?
            <h5><Badge pill color={taskStatusColor[row.status]}>
                {toSentenceCase(row.status) + (row.status === 'rejected' ? 
                ' by ' + row.rejected_by : '')}
            </Badge></h5> : "-"
    },
]

const types = [
    { label: 'Security', value: 'security', },
    { label: 'Service', value: 'service', },
    { label: 'Delivery', value: 'delivery', },
]

const statuses = [
    { label: 'Created', value: 'created', },
    { label: 'Canceled', value: 'canceled', },
    { label: 'Assigned', value: 'assigned', },
    { label: 'In Progress', value: 'in_progress', },
    { label: 'Reported', value: 'reported', },
    { label: 'Rejected', value: 'rejected', },
    { label: 'Approved', value: 'approved', },
    { label: 'Completed', value: 'completed', },
    { label: 'Timeout', value: 'timeout', },
    
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
    const { loading, items, total_pages, total_items, refreshToggle } = useSelector(state => state.task);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

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
        console.log(selectedRow);

        let role = selectedRow.task_type === 'security' ? 'security' :
            selectedRow.task_type === 'service' ? 'technician' : 'courier';

        assign && (!search || search.length >= 3) && get(endpointManagement + '/admin/staff/list' +
            '?limit=5&page=1&max_ongoing_task=1' +
            '&staff_role=' + role + "&status=active" +
            '&task_priority=' + selectedRow.priority +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.firstname + ' ' + el.lastname,
                    value: el.id
                }));

                setStaffs(formatted);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headers, search, selectedRow]);

    return (
        <div>
            <Modal isOpen={resolve} toggle={() => setResolve(false)} disableFooter disableHeader >
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
            <Modal isOpen={assign} toggle={() => setAssign(false)}>
                Choose assignee:
                {staffs.length !== 0 && !staff.value && <Input label="Search" icon={<FiSearch />}
                    compact inputValue={search} setInputValue={setSearch} />}
                <Filter data={staff.value ? [staff] : staffs} onClick={el => setStaff(el)} />
                {staffs.length === 0 ? <p style={{
                    fontStyle: 'italic'
                }}>No elligible staff found.</p> : <div style={{
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
                    </div>}
            </Modal>
            <Switch>
                <Route exact path={path}>
                    <Table totalItems={total_items}
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
                                hidex: building === "",
                                label: <p>{building ? "Building: " + buildingName : "Building: All"}</p>,
                                delete: () => { setBuilding(""); },
                                component: (toggleModal) =>
                                    <>
                                        <Input
                                            label="Search Building"
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
                                hidex: type === "",
                                label: <p>{type ? "Type: " + typeLabel : "Type: All"}</p>,
                                delete: () => { setType(""); },
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
                                hidex: prio === "",
                                label: <p>{prio ? "Priority: " + prioLabel : "Priority: All"}</p>,
                                delete: () => { setPrio(""); },
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
                                hidex: status === "",
                                label: <p>{status ? "Status: " + statusLabel : "Status: All"}</p>,
                                delete: () => { setStatus(""); },
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
                        onClickChat={row => {
                            dispatch(setSelected(row));
                            history.push("/chat");
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
