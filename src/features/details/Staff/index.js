import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import { useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { endpointManagement } from '../../../settings';
import { deleteStaff } from '../../slices/staff';

const details = {
    'Profile': ['created_on', 'gender', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Management': ['building_management_id', 'staff_id', 'staff_role'],
    'Bank Account': ['account_name', 'account_no', 'account_bank'],
};

function Component() {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointManagement + '/admin/staff/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <Template
            image={data.photo}
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
