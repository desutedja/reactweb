import React, { } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';

import './style.css';
import { staffRoleFormatter, toSentenceCase } from '../../utils';

function Component({ id, data = {}, compact = false }) {

    const { role } = useSelector(state => state.auth);

    return (
        <Link to={'/' + role + '/staff/' + id} className={!compact ? "Item" : "Item-compact"}>
            <Avatar className="Item-avatar" size="40" src={data.photo}
                name={data.firstname + ' ' + data.lastname} round
                email={data.photo ? null : data.email} />
            {!compact &&
                <div>
                    <b>{data.firstname + ' ' + data.lastname}</b>
                    <p className="Item-subtext">{
                        staffRoleFormatter(data.staff_role) + (data.staff_specialization ? ' - ' + toSentenceCase(data.staff_specialization) : '')
                    }</p>
                </div>
            }
        </Link>
    );
}

export default Component;
