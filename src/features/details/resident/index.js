import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Unit from './contents/Unit';
import Subaccount from './contents/Subaccount';
import { useParams } from 'react-router-dom';
import { get } from '../../slice';

const details = {
    'Profile': ['created_on', 'gender', 'birthplace', 'birthdate', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Bank Account': ['account_name', 'account_no', 'account_bank'],
};

function Component() {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();

    useEffect(() => {
        // dispatch(get())
    }, [id])

    return (
        <Template
            image={data.photo}
            title={data.firstname + ' ' + data.lastname}
            email={data.email}
            phone={data.phone}
            labels={["Details", "Unit", "Sub Account"]}
            contents={[
                <Detail data={data} labels={details} />,
                <Unit />,
                <Subaccount />,
            ]}
        />
    )
}

export default Component;
