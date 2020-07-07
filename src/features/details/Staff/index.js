import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import { useLocation, useParams } from 'react-router-dom';
import { get } from '../../slice';
import { endpointManagement } from '../../../settings';

const details = {
    'Profile': ['created_on', 'gender', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Management': ['building_management_id', 'staff_id', 'staff_role'],
    'Bank Account': ['account_name', 'account_no', 'account_bank'],
};

function Component() {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { state } = useLocation();
    let { id } = useParams();

    useEffect(() => {
        !state && dispatch(get(endpointManagement + '/admin/staff/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id, state])

    return (
        <Template
            image={state ? state.photo : data.photo}
            title={state ? state.firstname + ' ' + state.lastname : data.firstname + ' ' + data.lastname}
            email={state ? state.email : data.email}
            phone={state ? state.phone : data.phone}
            labels={["Details"]}
            contents={[
                <Detail data={state ? state : data} labels={details} />,
            ]}
        />
    )
}

export default Component;
