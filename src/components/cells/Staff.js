import React, { } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import './style.css';
import { staffRoleFormatter, toSentenceCase } from '../../utils';
import { setSelected } from '../../features/slices/staff';

function Component({ id, data = {}, compact = false }) {
    let dispatch = useDispatch();
    let history = useHistory();

    return (
        <div className={!compact ? "Item" : "Item-compact"} onClick={() => {
            history.push({
                pathname: 'staff/' + id,
                state: data,
            });
            dispatch(setSelected(data));
        }}>
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
        </div>
    );
}

export default Component;
