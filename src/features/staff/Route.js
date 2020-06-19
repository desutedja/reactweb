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
import Add from './Add';
import Details from './Details';
import Pill from '../../components/Pill';
import Tile from '../../components/Tile';

const columns = [
    { Header: "ID", accessor: "id" },
    {
        Header: "Staff",
        accessor: row => <UserAvatar fullname={row.firstname + ' ' + row.lastname} email={toSentenceCase(row.staff_role)} picture={row.photo}/>,
    },
    //{ Header: "Ongoing Task", accessor: row => row.ongoing_task ? row.ongoing_task : "-"},
    { Header: "Email", accessor: "email" },
    //{ Header: "Phone", accessor: "phone" },
    //{ Header: "Gender", accessor: "gender" },
    { Header: "Building Management", accessor: "building_name"}, 
    { Header: "Management", accessor: row => row.staff_role === "courier" ? 
            (row.on_centratama ? "Centratama Courier" : row.management_name) : row.management_name },
    {
        Header: "Available", accessor: row => 
        row.staff_role === "courier" ? (row.is_available ? <Pill color="success">Accepting Order</Pill> : <Pill color="secondary">No</Pill>) : 
        row.staff_role === "gm_bm" || row.staff_role === "pic_bm" ? "-" : 
        (row.current_shift_status ? <Pill color="success">On Shift</Pill>:<Pill color="secondary">No</Pill>)
    },
    {
        Header: "Status", accessor: row => <Pill color={
            row.status === 'active' ? "success" : 'secondary'
        }>{toSentenceCase(row.status)}</Pill>
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
    { label: 'Available', value: 'yes', },
    { label: 'Not Available', value: 'no', },
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
                                hidex: building === "",
                                label: <p>{building ? "Building: " + buildingName : "Select Building"}</p>,
                                delete: () => { setBuilding(""); setBuildingName(""); },
                                component: (toggleModal) =>
                                    <>
                                        <Input
                                            placeholder="Search Building Name"
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
                                hidex: shift === "",
                                label: <p>{shiftLabel ? "Availability: " + shiftLabel : "Select Availability"}</p>,
                                delete: () => { setShift(""); setShiftLabel(""); },
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
                                hidex: role === "",
                                label: <p>{role ? "Role: " + roleLabel : "Select Role"}</p>,
                                delete: () => { setRole(""); setRoleLabel(""); },
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
                            <Button key="Add Staff" label="Add Staff" icon={<FiPlus />}
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
