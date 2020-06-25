import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiSearch, FiPlus } from 'react-icons/fi';

import { toSentenceCase } from '../../utils';
import { endpointAdmin } from '../../settings';

import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Input from '../../components/Input';
import Pill from '../../components/Pill';
import Staff from '../../components/items/Staff';
import { get } from '../slice';
import { getStaff, setSelected, deleteStaff } from '../staff/slice';

import Template from './components/Template';

const columns = [
    // { Header: "ID", accessor: "id" },
    {
        Header: "Staff",
        accessor: row => <Staff id={row.id} />,
    },
    //{ Header: "Ongoing Task", accessor: row => row.ongoing_task ? row.ongoing_task : "-"},
    { Header: "Email", accessor: "email" },
    //{ Header: "Phone", accessor: "phone" },
    //{ Header: "Gender", accessor: "gender" },
    { Header: "Building Management", accessor: "building_name" },
    {
        Header: "Management", accessor: row => row.staff_role === "courier" ?
            (row.on_centratama ? "Centratama Courier" : row.management_name) : row.management_name
    },
    {
        Header: "Available", accessor: row =>
            row.staff_role === "courier" ? (row.is_available ? <Pill color="success">Accepting Order</Pill> : <Pill color="secondary">No</Pill>) :
                row.staff_role === "gm_bm" || row.staff_role === "pic_bm" ? "-" :
                    (row.current_shift_status ? <Pill color="success">On Shift</Pill> : <Pill color="secondary">No</Pill>)
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
    const [shift, setShift] = useState('');
    const [shiftLabel, setShiftLabel] = useState('');

    const [search, setSearch] = useState('');
    const [building, setBuilding] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [buildings, setBuildings] = useState('');

    const [role, setRole] = useState('');
    const [roleLabel, setRoleLabel] = useState('');

    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    useEffect(() => {
        search.length >= 3 && get(endpointAdmin + '/building' +
            '?limit=5&page=1' +
            '&search=' + search, res => {
                let data = res.data.data.items;

                let formatted = data.map(el => ({ label: el.name, value: el.id }));

                setBuildings(formatted);
            })
    }, [search]);

    return (
        <Template
            columns={columns}
            slice='staff'
            getAction={getStaff}
            filterVars={[role, building, shift]}
            filters={[
                {
                    hidex: building === "",
                    label: <p>{building ? "Building: " + buildingName : "Building: All"}</p>,
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
                    label: <p>{shiftLabel ? "Availability: " + shiftLabel : "Availability: All"}</p>,
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
                    label: <p>{role ? "Role: " + roleLabel : "Role: All"}</p>,
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
            deleteAction={deleteStaff}
        />
    )
}

export default Component;
