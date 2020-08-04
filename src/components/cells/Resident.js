import React, {  } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { useRouteMatch, Link } from 'react-router-dom';

import './style.css';

function Component({ id, data = {}, compact=false, onClick=null }) {
    let { path } = useRouteMatch();

    const { role } = useSelector(state => state.auth);

    return (
        <Link to={'/' + role + '/resident/' + id} className={ !compact ? "Item" : "Item-compact" }>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            { !compact &&
            <>
            <span> </span>
            <div >
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div> 
            </>
            }
        </Link>
    );
}

export default Component;
