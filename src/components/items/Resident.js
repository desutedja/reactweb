import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { get } from '../../features/slice';
import { endpointResident } from '../../settings';
import './style.css';


function Component({ id }) {
    const [data, setData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        photo: '',
    });

    let dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        dispatch(get(endpointResident + '/management/resident/detail/' + id, res => {
            setData(res.data.data);
        }))
    }, [dispatch, id])

    return (
        <div className="Item" onClick={() => history.push({
            pathname: '/resident/' + id,
            state: data
        })}>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            <span> </span>
            <div >
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div>
        </div>
    );
}

export default Component;
