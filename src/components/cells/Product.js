import React, { } from 'react';
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import './style.css';

function Component({ id, data }) {
    const { role } = useSelector(state => state.auth);

    return (
        <Link to={'/' + role + '/product/' + id} className="Item">
            <Avatar className="Item-avatar" size="40" src={data.thumbnails}
                name={data.name} />
            <span> </span>
            <div >
                <b>{data.name}</b>
                <p className="Item-subtext"><i>{data.merchant_name}</i></p>
            </div>
        </Link>
    );
}

export default Component;
