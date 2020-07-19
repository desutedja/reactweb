import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { get } from '../slice';
import Detail from './components/Detail';
import Template from './components/Template';
import { endpointAdmin } from '../../settings';

const details =
{
    'Information': ['id', 'created_on', 'firstname', 'lastname', 'email', 'phone', 'group', 'status'],
};

function AdminDetails() {
    const { selected } = useSelector(state => state.admin);
    const [data, setData] = useState();

    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointAdmin + '/centratama/details/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <Template
            title={data ? data.firstname + ' ' + data.lastname : selected.firstname + ' ' + selected.lastname}
            phone={data ? data.phone : selected.phone}
            labels={["Details"]}
            contents={[
                <Detail type="Admin" data={data ? data : selected} labels={details} />,
            ]}
        />
    )
}

export default AdminDetails;
