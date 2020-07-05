import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch } from 'react-icons/fi';

import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Tile from '../../components/Tile';
import Pill from '../../components/Pill';

import Resident from '../../components/cells/Resident';
import Staff from '../../components/cells/Staff';
// import Building from '../../components/cells/Building';

import { toSentenceCase, dateTimeFormatter, toEllipsis } from '../../utils';
import { endpointAdmin, endpointManagement, taskStatusColor } from '../../settings';
import { getTask, getTaskDetails, resolveTask, reassignTask, setSelected } from '../slices/task';
import { get } from '../slice';

import Template from './components/Template';

const columns = [
    // { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: row => <Tile items={[row.title, <small>{toEllipsis(row.ref_code, 17)}</small>]} /> },
    { Header: "Type", accessor: row =>  row.task_type === "service" ? <>{ toSentenceCase(row.task_type) + 
            (row.task_specialization ? ("- " + row.task_specialization) : "") }</> : 
        toSentenceCase(row.task_type) },
    {
        Header: "Priority", accessor: row =>
            <Pill color={
                row.priority === "emergency" ? "danger" :
                    row.priority === "high" ? "warning" : "success"
            }>
                {toSentenceCase(row.priority)}
            </Pill>
    },
    { Header: "Requester", accessor: row => <Resident compact={true} id={row.requester_id} onClickPath={"resident"} /> },
    // { Header: "Building", accessor: row => <Building id={row.requester_building_id} /> },
    { Header: "Assignee", accessor: row => row.assignee_id ? <Staff compact={true} id={row.assignee_id} /> : "-" },
    { Header: "Assigned on", accessor: row => row.assigned_on ? dateTimeFormatter(row.assigned_on) : "-" },
    {
        Header: "Status", accessor: row => row.status ?
            <Pill color={taskStatusColor[row.status]}>
                {
                    toSentenceCase(row.status) + (row.status === 'created' && row.priority === 'emergency' ? ':Searching for Security' : '')
                    + (row.status === 'rejected' ? ' by ' + row.rejected_by : '')
                }

            </Pill> : "-"
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

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        (!search || search.length >= 3) && dispatch(get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            }))
    }, [dispatch, search]);

    useEffect(() => {
        console.log(selectedRow);

        let role = selectedRow.task_type === 'security' ? 'security' :
            selectedRow.task_type === 'service' ? 'technician' : 'courier';

        assign && (!search || search.length >= 3) && dispatch(get(endpointManagement + '/admin/staff/list' +
            '?limit=5&page=1&max_ongoing_task=1' +
            '&staff_role=' + role + "&status=active" +
            (selectedRow.priority === "emergency" ? '&is_ongoing_emergency=true' : '') +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({
                    label: el.firstname + ' ' + el.lastname,
                    value: el.id
                }));

                setStaffs(formatted);
            }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, search, selectedRow]);

    return (
        <>
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
                            dispatch(resolveTask(selectedRow));
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
                                dispatch(reassignTask({
                                    "task_id": selectedRow.id,
                                    "assignee_id": staff.value,
                                }));
                            }}
                        />
                    </div>}
            </Modal>
            <Template
                columns={columns}
                slice='task'
                getAction={getTask}
                filterVars={[type, prio, status, building]}
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
                onClickDetails={row => dispatch(getTaskDetails(row, history, url))}
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
        </>
    )
}

export default Component;
