import React, { useState, useEffect } from 'react';
import {
    useDispatch,
    // useSelector
} from 'react-redux';

import Detail from '../components/Detail';
import Template from '../components/Template';

import Unit from './contents/Unit';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { get } from '../../slice';
import { endpointResident } from '../../../settings';
import { deleteResident } from '../../slices/resident';

const details = {
    'Profile': ['created_on', 'gender', 'birthplace', 'birthdate', 'nationality', 'marital_status', 'status_kyc'],
    'Address': ['address', 'district_name', 'city_name', 'province_name'],
    'Bank Account': ['account_name', 'account_no', 'account_bank'],
};

function Component() {
    let { state } = useLocation();
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let { id } = useParams();
    let history = useHistory();

    useEffect(() => {
        !state && dispatch(get(endpointResident + '/management/resident/detail/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id, state])

    return (
        <Template
            image={data.photo}
            title={data.firstname + ' ' + data.lastname}
            email={data.email}
            phone={data.phone}
            labels={["Details", "Unit"]}
            activeTab={0}
            contents={[
                <Detail data={data} labels={details}
                    onDelete={() => dispatch(deleteResident(data, history))}
                />,
                <Unit id={id} />,
            ]}
        />
    )
}

export default Component;
