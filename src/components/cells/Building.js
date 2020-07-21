import React, { } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import './style.css';
import { setSelected } from '../../features/slices/building';


function Component({ id, data }) {
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
            console.log(data)
        }}>
            <Avatar className="Item-avatar" size="40" round={8} src={data.logo}
                name={data.name}
                email={data.logo ? null : data.email} />
            <span> </span>
            <div>
                <b>{data.name}</b>
                <p className="Item-subtext">{data.management_name ? data.management_name
                    : <i>No Management</i>
                }</p>
            </div>
        </div>
    );
}

export default Component;
