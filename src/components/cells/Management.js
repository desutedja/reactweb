import React, {  } from 'react';
import Avatar from 'react-avatar';
import { useRouteMatch, Link } from 'react-router-dom';

import './style.css';

function Component({ id, data }) {
    let { path } = useRouteMatch();

    return (
        <Link to={path + '/' + id} className="Item">
            <Avatar className="Item-avatar" size="40" round={8} src={data.logo}
                name={data.name}
                email={data.logo ? null : data.email} />
            <span></span>
            <div>
                <b>{data.name}</b>
                <p className="Item-subtext">{data.email}</p>
            </div>
        </Link>
    );
}

export default Component;
