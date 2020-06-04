import React, { useCallback, useState, useEffect } from 'react';
import { useRouteMatch, Switch, Route, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiPlus } from 'react-icons/fi';

import { getStaff, setSelected, getStaffDetails, deleteStaff } from './slice';
import { get, toSentenceCase } from '../../utils';
import { endpointAdmin } from '../../settings';

import UserAvatar from '../../components/UserAvatar';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Pills from '../../components/Pills';
import { Badge } from 'reactstrap';
import Add from './Add';
import Details from './Details';

const columns = [
    { Header: "ID", accessor: "id" },
    { 
        Header: "Staff", 
        accessor: row => [row.firstname + ' ' + row.lastname, row.email],
        Cell: acc => {
            return <UserAvatar fullname={acc.value[0]} email={acc.value[1]} />;
        }
    },
    { Header: "Role", accessor: row => toSentenceCase(row.staff_role) },
    { Header: "Phone", accessor: "phone" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Building", accessor: "building_name" },
    { Header: "Management", accessor: "management_name" },
    {
        Header: "On Shift", accessor: row => !row.on_shift_until ? <Badge pill color="success">
            Yes
    </Badge> : new Date(row.on_shift_until) > new Date() ? <Badge pill color="success">
                {toSentenceCase(row.on_shift)}
            </Badge> : <Badge pill color="secondary">
                    No
    </Badge>
    },
    {
        Header: "Status", accessor: row => <Badge pill color={
            row.status === 'active' ? "success" : 'secondary'
        }>{row.status}</Badge>
    },
]

const roles = [
    { label: 'GM BM', value: 'gm_bm' },
    { label: 'PIC BM', value: 'pic_bm' },
    { label: 'Technician', value: 'technician' },
    { label: 'Courier', value: 'courier' },
    { label: 'Security', value: 'security' }
];


const shifts = [
    { label: 'Yes', value: 'yes', },
    { label: 'No', value: 'no', },
]

function Component() {
    const [confirm, setConfirm] = useState(false);
    const [selectedRow, setRow] = useState({});

    const [shift, setShift] = useState('');
    const [shiftLabel, setShiftLabel] = useState('');

    const [search, setSearch] = useState('');
    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [role, setRole] = useState('');
    const [roleLabel, setRoleLabel] = useState('');

    const headers = useSelector(state => state.auth.headers);
    const { loading, items, total_pages, total_items, refreshToggle, } = useSelector(state => state.staff);

    let dispatch = useDispatch();
    let history = useHistory();
    let { path, url } = useRouteMatch();

    useEffect(() => {
        search.length >= 3 && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, headers, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [headers, search]);

    return (
        <div>
            <Modal isOpen={confirm} onRequestClose={() => setConfirm(false)}>
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
                            dispatch(deleteStaff(selectedRow, headers));
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
                            dispatch(getStaff(headers, pageIndex, pageSize, search, role, building, shift));
                            // eslint-disable-next-line react-hooks/exhaustive-deps
                        }, [dispatch, refreshToggle, headers, role, building, shift])}
                        filters={[
                            {
                                button: <Button key="Select Shift"
                                    label={shiftLabel ? shiftLabel : "Select Shift"}
                                    selected={shift}
                                />,
                                component: (toggleModal) => 
                                <Filter
                                            data={shifts}
                                            onClick={(el) => {
                                                setShift(el.value);
                                                setShiftLabel(el.label);
                                                toggleModal(false);
                                            }}
                                            onClickAll={() => {
                                                setShift("");
                                                setShiftLabel("");
                                                toggleModal(false);
                                            }}
                                        />
                            },
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
                                button: <Button key="Select Role"
                                    label={role ? roleLabel : "Select Role"}
                                    selected={role}
                                />,
                                component: toggleModal =>
                                    <Filter
                                        data={roles}
                                        onClickAll={() => {
                                            setRole("");
                                            setRoleLabel("");
                                            toggleModal(false);
                                        }}
                                        onClick={el => {
                                            setRole(el.value);
                                            setRoleLabel(el.label);
                                            toggleModal(false);
                                        }}
                                    />
                            },
                        ]}
                        actions={[
                            <Button key="Add" label="Add" icon={<FiPlus />}
                                onClick={() => {
                                    dispatch(setSelected({}));
                                    history.push(url + "/add")
                                }}
                            />
                        ]}
                        onClickDelete={row => {
                            setRow(row);
                            setConfirm(true);
                        }}
                        onClickDetails={row => dispatch(getStaffDetails(row, headers, history, url))}
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
