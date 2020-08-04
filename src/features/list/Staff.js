import React, { useState, useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  FiPlus } from 'react-icons/fi';

import { toSentenceCase } from '../../utils';

import Button from '../../components/Button';
import Filter from '../../components/Filter';
import Pill from '../../components/Pill';
import Staff from '../../components/cells/Staff';
import { getStaff, setSelected, deleteStaff } from '../slices/staff';

import Template from './components/Template';

const columns = [
    {
        Header: "Staff",
        accessor: row => <Staff id={row.id} data={row} />,
    },
    { Header: "Email", accessor: row => <a href={"mailto:" + row.email}>{row.email}</a> },
    { Header: "Building", accessor: "building_name" },
    {
        Header: "Management", accessor: "management_name" 
    },
    {
        Header: "Available", accessor: row =>
            row.staff_role === "courier" ? (row.is_available ? <Pill color="success">Accepting Order</Pill> : <Pill color="secondary">No</Pill>) :
                row.staff_role === "gm_bm" || row.staff_role === "pic_bm" ? <Pill color="success">Always</Pill> :
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

function Component({ view }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    const { auth } = useSelector(state => state)
    const [shift, setShift] = useState('');
    const [shiftLabel, setShiftLabel] = useState('');

    const [building,
        // setBuilding
    ] = useState('');

    const [management,
        // setManagement
    ] = useState('');

    const [role, setRole] = useState(history.location.state ? history.location.state.role : '');
    const [roleLabel, setRoleLabel] = useState(history.location.state ? history.location.state.roleLabel : '');


    useEffect(() => {
        if (auth.role === 'bm') {
            const blacklist_modules = auth.user.blacklist_modules;
            const isSecurity = blacklist_modules.find(item => item.module === 'security') ? true : false;
            const isInternalCourier = blacklist_modules.find(item => item.module === 'internal_courier') ? true : false;
            const isTechnician = blacklist_modules.find(item => item.module === 'technician') ? true : false;
    
            if (isTechnician) delete roles[2];
            if (isInternalCourier) delete roles[3];
            if (isSecurity) delete roles[4];
        }
    }, [auth])
    return (
        <Template
            view={view}
            columns={columns}
            slice='staff'
            getAction={getStaff}
            filterVars={[role, building, shift, management]}
            filters={[
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
            actions={view ? null : [
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
