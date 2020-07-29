import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { get, setConfirmDelete } from '../slice';
import Detail from './components/Detail';
import Template from './components/Template';
import { endpointAdmin } from '../../settings';
import { deleteAdmin } from '../slices/admin';

const details =
{
    'Information': ['id', 'created_on', 'firstname', 'lastname', 'email', 'phone', 'group', 'status'],
};

function AdminDetails() {
    const [data, setData] = useState({});

    let history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(get(endpointAdmin + '/centratama/details/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <Template
            title={data ? data.firstname + ' ' + data.lastname : data.firstname + ' ' + data.lastname}
            phone={data ? data.phone : data.phone}
            loading={!data.id}
            labels={["Details"]}
            contents={[
                <Detail type="Admin" data={data} labels={details}
                onDelete={() => dispatch(setConfirmDelete("Are you sure to delete this item?",
                            () => dispatch(deleteAdmin(data, history))
                        ))}
                />,
            ]}
        />
    )
}

export default AdminDetails;
