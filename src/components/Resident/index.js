import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { get } from '../../features/slice';
import { endpointResident } from '../../settings';
import './style.css';


function Component({ id }) {
    const [data, setData] = useState({});

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointResident + '/management/resident/detail/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <div className="Resident" onClick={() => history.push('/resident/' + id)}>
            <Avatar style={{ marginRight: '10px' }} size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round email={data.email} />
            <span> </span>
            <div style={{ display: 'block' }}>
                <div>{data.firstname + ' ' + data.lastname}</div>
            </div>
        </div>
    );
}

export default Component;
