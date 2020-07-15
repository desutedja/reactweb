import React, { } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import './style.css';
import { setSelected } from '../../features/slices/product';


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
        }}>
            <Avatar className="Item-avatar" size="40" src={data.thumbnails}
                name={data.name} />
            <span> </span>
            <div >
                <b>{data.name}</b>
                <p className="Item-subtext"><i>{data.merchant_name}</i></p>
            </div>
        </div>
    );
}

export default Component;
