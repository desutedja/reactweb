import React, { } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import './style.css';
import { setSelected } from '../../features/slices/admin';


function Admin({ id, data }) {
    let dispatch = useDispatch();
    let history = useHistory();
    let { path } = useRouteMatch();

    return (
        <div className="Item" onClick={() => {
            history.push({
                pathname: path + '/' + id,
                state: data
            });
            dispatch(setSelected(data));
        }}>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            <div>
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div>
        </div>
    );
}

export default Admin;
