import React, {  } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import './style.css';

function Component({ id, data = {}, compact=false, onClick=null }) {

    const { role } = useSelector(state => state.auth);

    return (
        <Link to={'/' + role + '/resident/' + id} className={ !compact ? "Item2" : "Item-compact" }>
            <Avatar className="Item-avatar2" size="20" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            { !compact &&
            <>
            <span> </span>
            <div>
                <b>{data.firstname + ' ' + data.lastname}</b>
                <p className="Item-subtext">{data.email}</p>
            </div> 
            </>
            }
        </Link>
    );
}

export default Component;
