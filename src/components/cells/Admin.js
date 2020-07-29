import React, { } from 'react';
import Avatar from 'react-avatar';
import { useRouteMatch, Link } from 'react-router-dom';

import './style.css';


function Admin({ id, data }) {
    let { path } = useRouteMatch();

    return (
        <Link className="Item" to={path + '/' + id}>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            <div>
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div>
        </Link>
    );
}

export default Admin;
