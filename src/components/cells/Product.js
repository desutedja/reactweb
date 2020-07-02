import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { get } from '../../features/slice';
import { toMoney } from '../../utils';
import { endpointMerchant } from '../../settings';
import './style.css';
import { setSelected } from '../../features/slices/product';


function Component({ id, merchantName }) {
    const [data, setData] = useState({
        name: 'Loading..',
        discount_price: '',
        total_selling_price: '',
        thumbnails: '',
    });

    let dispatch = useDispatch();
    let history = useHistory();
    let { path } = useRouteMatch();

    useEffect(() => {
        dispatch(get(endpointMerchant + '/admin/items?id=' + id, res => {
            setData(res.data.data);
    }))
    }, [dispatch, id])

    return (
        <div className="Item" onClick={() => {
            history.push({
                pathname: path + '/' + id,
                state: data
            });
            dispatch(setSelected(data));
        }}>
            <Avatar className="Item-avatar" size="40" src={data.thumbnails}
                name={data.name}/>
            <span> </span>
            <div >
                <b>{data.name}</b>
                <p className="Item-subtext"><i>{merchantName}</i></p>
            </div>
        </div>
    );
}

export default Component;
