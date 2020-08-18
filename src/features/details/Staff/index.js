import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import { useParams, useHistory } from 'react-router-dom';
import { get, setConfirmDelete } from '../../slice';
import Pill from '../../../components/Pill'
import { dateTimeFormatter, toSentenceCase, staffRoleFormatter } from '../../../utils';
import { endpointManagement } from '../../../settings';
import { deleteStaff, setSelected } from '../../slices/staff';

function Component({ view }) {
    const { auth } = useSelector(state => state);
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();
    let history = useHistory();

    const details = useMemo(() => {
        return {
            'Profile': ['created_on', 'gender', 'nationality', 'marital_status'],
            'Address': ['address', 'district_name', 'city_name', 'province_name'],
            'Availability Status': [
                {
                    disabled: data.staff_role === "courier",
                    label: 'current_shift_status', vfmt: v =>
                        data.staff_role === "gm_bm" || data.staff_role === "pic_bm" ? <Pill color="success">Always</Pill> :
                            v ? <Pill color="success">On Shift</Pill> : <Pill color="secondary">No</Pill>
                },
                {
                    disabled: data.staff_role === "courier",
                    label: 'on_shift_until', lfmt: () => !data.current_shift_status ? "Last Shift Ended At" : "On Shift Until",
                    vfmt: (v) => v ? dateTimeFormatter(v) : "-"
                },
                {
                    disabled: data.staff_role !== "courier",
                    label: 'is_available', lfmt: () => "Accepting Order", vfmt: (v) => <Pill color={v ? "success" : "secondary"}>{v ? "Yes" : "No"}</Pill>
                },
            ],
            'Management': [
                'management_name',
                { label: 'staff_id', lfmt: () => "Identity No" },
                { label: 'staff_role', lfmt: () => "Staff Role", vfmt: (v) => staffRoleFormatter(v) },
                {
                    disabled: data.staff_role !== "Technician",
                    label: 'staff_specialization', lfmt: () => "Specialization", vfmt: (v) => v ? toSentenceCase(v) : "-"
                },
            ],
            'Bank Account': ['account_name', 'account_number', 'account_bank'],
        }
    }, [data]);


    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/staff/' + id, res => {
            setData(res.data.data);
            dispatch(setSelected(res.data.data));
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
                <Detail view={view} data={data} labels={details}
                    onDelete={
                        auth?.role && auth.role === 'bm' ? auth.user.id === data.id ? false : (
                            () => dispatch(setConfirmDelete("Are you sure to delete this item?",
                                () => dispatch(deleteStaff(data, history))
                            ))
                        ) : (
                            () => dispatch(setConfirmDelete("Are you sure to delete this item?",
                                () => dispatch(deleteStaff(data, history))
                            ))
                        )
                    }
                />,
            ]}
        />
    )
}

export default Component;
