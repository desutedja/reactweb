import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import { useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import Pill from '../../../components/Pill'
import { dateTimeFormatter, toSentenceCase, staffRoleFormatter } from '../../../utils';
import { endpointManagement } from '../../../settings';
import { deleteStaff } from '../../slices/staff';

function Component() {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();
    let history = useHistory();

    const details = useMemo(() => { return {
    'Profile': ['created_on', 'gender', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Availability Status': [
        { disabled: data.staff_role === "courier",
            label: 'on_shift', vfmt: (v) => <Pill color={v === "no" ? "secondary" : "success"}>{toSentenceCase(v)}</Pill> },
        { disabled: data.staff_role === "courier", 
            label: 'on_shift_until', lfmt: () => data.on_shift === "no" ? "Last Shift Ended At" : "On Shift Until", 
            vfmt: (v) => v ? dateTimeFormatter(v) : "-"},
        { disabled: data.staff_role !== "courier",
            label: 'is_available', lfmt: () => "Accepting Order", vfmt: (v) => <Pill color={v ? "success" : "secondary"}>{v ? "Yes" : "No"}</Pill>},
    ],
    'Management': [
        'building_management_id', 
        { label: 'staff_id', lfmt: () => "Staff ID" },
        { label: 'staff_role', lfmt: () => "Staff Role", vfmt: (v) => staffRoleFormatter(v)},
        { label: 'staff_specialization', lfmt: () => "Specialization", vfmt: (v) => v ? toSentenceCase(v) : "-" },
    ],
    'Bank Account': ['account_name', 'account_number', 'account_bank'],
}}, [data]);


    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/staff/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <Template
            image={data.photo || "placeholder"}
            title={data.firstname + ' ' + data.lastname}
            email={data.email}
            phone={data.phone}
            loading={!data.id}
            labels={["Details"]}
            contents={[
                <Detail data={ data} labels={details}
                    onDelete={() => dispatch(deleteStaff(data, history))}
                />,
            ]}
        />
    )
}

export default Component;
